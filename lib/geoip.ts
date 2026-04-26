import { Country, getCountryByCode } from "./countries";

export interface GeoLocation {
  country: string;
  countryCode: string;
  countryName: string;
  dialCode: string;
  flag: string;
}

export async function detectLocation(): Promise<GeoLocation | null> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const countryCode = data.country_code as string;
    const country = getCountryByCode(countryCode);

    if (!country) {
      return null;
    }

    return {
      country: country.name,
      countryCode: country.code,
      countryName: data.country_name || country.name,
      dialCode: country.dialCode,
      flag: country.flag,
    };
  } catch {
    return null;
  }
}

