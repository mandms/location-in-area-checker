export interface ISuggestion {
  id: string,
  address: string,
  lat: number,
  lng: number,
  type: string,
  importance: number
}

export type ISuggestionsResponse = Omit<ISuggestion, 'id' | 'address'> & {
  place_id: string,
  display_name: string,
  lat: string,
  lon: string
}

export type TPoint = {
  lat: number,
  lng: number
}
