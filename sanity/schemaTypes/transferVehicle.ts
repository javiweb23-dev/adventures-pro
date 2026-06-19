import { defineField, defineType } from "sanity";

export const transferVehicleType = defineType({
  name: "transferVehicle",
  title: "Transfer Vehicle",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "price",
      title: "Price",
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
    defineField({
      name: "zones",
      title: "Operating zones",
      type: "array",
      of: [{ type: "reference", to: [{ type: "transferZone" }] }],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      capacity: "capacity",
      media: "image",
    },
    prepare({ title, capacity, media }) {
      return {
        title: title || "Untitled vehicle",
        subtitle: capacity,
        media,
      };
    },
  },
});
