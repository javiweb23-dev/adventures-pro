import { defineArrayMember, defineField, defineType } from "sanity";

export const transferRouteType = defineType({
  name: "transferRoute",
  title: "Transfer Route",
  type: "document",
  fields: [
    defineField({
      name: "originCode",
      title: "Origin code",
      type: "string",
      options: {
        list: [
          { title: "PUJ", value: "PUJ" },
          { title: "LRM", value: "LRM" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destinationZone",
      title: "Destination zone",
      type: "reference",
      to: [{ type: "transferZone" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricingRates",
      title: "Pricing rates",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "vehicle",
              title: "Vehicle",
              type: "reference",
              to: [{ type: "transferVehicle" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "priceOneWay",
              title: "One-way price",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: "priceRoundTrip",
              title: "Round-trip price",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: "peekOneWayUrl",
              title: "Peek one-way URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "peekRoundTripUrl",
              title: "Peek round-trip URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              vehicleTitle: "vehicle.title",
              priceOneWay: "priceOneWay",
              priceRoundTrip: "priceRoundTrip",
            },
            prepare({ vehicleTitle, priceOneWay, priceRoundTrip }) {
              return {
                title: vehicleTitle || "Vehicle rate",
                subtitle: `OW $${priceOneWay ?? 0} · RT $${priceRoundTrip ?? 0}`,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      originCode: "originCode",
      zoneTitle: "destinationZone.title",
    },
    prepare({ originCode, zoneTitle }) {
      return {
        title: `${originCode || "?"} → ${zoneTitle || "Zone"}`,
      };
    },
  },
});
