import {useQuery} from "@tanstack/react-query";
import getAddressSuggestions from "../services/addressService.ts";

const useAddressSuggestions = (address: string) => {
    return useQuery({
      queryKey: ['addressSuggestions', address],
      queryFn: () => getAddressSuggestions(address),
      enabled: !!address.trim()
    })
}

export default useAddressSuggestions;