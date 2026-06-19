import { defineField, defineType } from "sanity";

export const transferHotelType = defineType({
  name: "transferHotel",
  title: "Transfer Hotel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "zone",
      title: "Zone",
      type: "reference",
      to: [{ type: "transferZone" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      zoneTitle: "zone.title",
    },
    prepare({ title, zoneTitle }) {
      return {
        title: title || "Untitled hotel",
        subtitle: zoneTitle,
      };
    },
  },
});
