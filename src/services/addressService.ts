import axios from "axios";
import type {ISuggestion, ISuggestionsResponse} from "../types.ts";

const getAddressSuggestions = async (address: string): Promise<ISuggestion[]> => {

  if (!address.trim()) {
    return [];
  }

  const response = await axios.get(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        countrycodes: 'ru',
        'accept-language': 'ru'
      }
    }
  );

  const suggestions: ISuggestion[] = response.data.map((item: ISuggestionsResponse) => ({
    id: item.place_id,
    address: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    type: item.type,
    importance: item.importance
  }));

  return suggestions;
}

export default getAddressSuggestions;