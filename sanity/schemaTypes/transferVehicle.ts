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
