import { defineField, defineType } from "sanity";

export const localizedStringType = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "es", title: "Spanish", type: "string" }),
    defineField({ name: "frCA", title: "French (Canada)", type: "string" }),
  ],
});
