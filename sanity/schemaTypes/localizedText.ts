import { defineField, defineType } from "sanity";

export const localizedTextType = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 5 }),
    defineField({ name: "es", title: "Spanish", type: "text", rows: 5 }),
    defineField({ name: "frCA", title: "French (Canada)", type: "text", rows: 5 }),
  ],
});
