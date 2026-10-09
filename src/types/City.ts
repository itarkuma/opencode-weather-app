export interface City {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export type Unit = "celsius" | "fahrenheit";
