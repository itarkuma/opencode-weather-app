export interface GeoCandidate {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparent: number;
  humidity: number;
  wind: number;
  code: number;
  time: string;
}

export interface DayForecast {
  date: string;
  code: number;
  max: number;
  min: number;
}
