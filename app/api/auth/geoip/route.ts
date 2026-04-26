import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/countries";

export async function GET(req: NextRequest) {
  try {
    // Get IP from headers (works with most hosting providers)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";

    // For localhost/development, return US as default
    if (ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      const us = getCountryByCode("US");
      return NextResponse.json({
        success: true,
        country: us?.name || "United States",
        countryCode: "US",
        dialCode: us?.dialCode || "+1",
        flag: us?.flag || "🇺🇸",
        note: "Development mode - defaulting to US",
      });
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { Accept: "application/json" },
    } as RequestInit);

    if (!response.ok) {
      throw new Error("GeoIP service unavailable");
    }

    const data = await response.json();
    const countryCode = data.country_code as string;
    const country = getCountryByCode(countryCode);

    if (!country) {
      return NextResponse.json(
        { success: false, message: "Country not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      country: data.country_name || country.name,
      countryCode: country.code,
      dialCode: country.dialCode,
      flag: country.flag,
    });
  } catch {
    // Fallback to US
    const us = getCountryByCode("US");
    return NextResponse.json({
      success: true,
      country: us?.name || "United States",
      countryCode: "US",
      dialCode: us?.dialCode || "+1",
      flag: us?.flag || "🇺🇸",
      note: "Fallback location",
    });
  }
}

