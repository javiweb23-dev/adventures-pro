import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

const hotelsQuery = groq`*[_type == "transferHotel"] | order(title asc) {
  _id,
  title,
  "zone": {
    "id": zone._ref,
    "title": zone->title
  }
}`;

const routesQuery = groq`*[_type == "transferRoute"] {
  _id,
  originCode,
  "destinationZone": {
    "id": destinationZone._ref,
    "title": destinationZone->title
  },
  pricingRates[]{
    _key,
    priceOneWay,
    priceRoundTrip,
    peekOneWayUrl,
    peekRoundTripUrl,
    "vehicle": vehicle->{
      _id,
      title,
      capacity,
      "imageUrl": image.asset->url
    }
  }
}`;

export async function GET() {
  try {
    const [hotels, routes] = await Promise.all([
      client.fetch(hotelsQuery),
      client.fetch(routesQuery),
    ]);
    return NextResponse.json({
      hotels: hotels ?? [],
      routes: routes ?? [],
    });
  } catch {
    return NextResponse.json({ hotels: [], routes: [] }, { status: 500 });
  }
}
