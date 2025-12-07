import React, {type ChangeEvent, useState} from "react";
import type {TPoint} from "../../types.ts";
import useDebounce from "../../hooks/useDebounce.ts";
import styles from "./AddressInput.module.scss";
import useAddressSuggestions from "../../hooks/useAddressSuggestions.ts";
import Overlay from "../ui/Overlay/Overlay.tsx";
import {Button} from "../ui/Button/Button.tsx";

interface AddressInputProps {
  setPoint: (point: TPoint) => void;
  point?: TPoint;
  polygon: TPoint[];
  onCheck: () => void;
}

const AddressInput: React.FC<AddressInputProps> = ({setPoint, point, polygon, onCheck}) => {
  const [address, setAddress] = useState<string>('');
  const debouncedAddress = useDebounce(address, 500);
  const {data: suggestions = []} = useAddressSuggestions(debouncedAddress);

  const [isFocused, setIsFocused] = useState(false);

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleSuggestionsClick = (id: string) => {
    const suggestion = suggestions.find(suggestion => suggestion.id === id);

    if (suggestion) {
      const point: TPoint = {
        lat: suggestion.lat,
        lng: suggestion.lng
      }

      setPoint(point);
      setAddress(suggestion.address)
      setIsFocused(false)
    }
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <>
      <Overlay show={isFocused}>
        <div className={styles.container}>
          <div className={styles.addressInputContainer}>
            <div className={styles.inputWrapper}
                 style={{borderRadius: isFocused && suggestions.length ? "16px 16px 0 0" : "16px"}}>
              <input
                className={styles.addressInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                type="text"
                value={address}
                onChange={handleAddressChange}
                id="address-input"
                placeholder="Введите ваш адрес"/>
              <Button
                variant="primary"
                size="small"
                className={styles.checkButton}
                onClick={onCheck}
                disabled={!point || polygon.length < 3}
              >
                Проверить
              </Button>
            </div>
            {isFocused && <ul className={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <li className={styles.suggestion} key={suggestion.id} onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSuggestionsClick(suggestion.id)}>{suggestion.address}</li>
              ))}
            </ul>}
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default AddressInput;