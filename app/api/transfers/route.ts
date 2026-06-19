import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

const transfersQuery = groq`*[_type == "transferHotel"] | order(title asc) {
  _id,
  title,
  "zone": {
    "id": zone._ref,
    "title": zone->title
  },
  "vehicles": *[_type == "transferVehicle" && references(^.zone._ref)] | order(price asc) {
    _id,
    title,
    capacity,
    price,
    peekOneWayUrl,
    peekRoundTripUrl,
    "imageUrl": image.asset->url
  }
}`;

export async function GET() {
  try {
    const hotels = await client.fetch(transfersQuery);
    return NextResponse.json({ hotels: hotels ?? [] });
  } catch {
    return NextResponse.json({ hotels: [] }, { status: 500 });
  }
}
