import { defineField, defineType } from "sanity";

export const transferZoneType = defineType({
  name: "transferZone",
  title: "Transfer Zone",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Untitled zone",
      };
    },
  },
});
