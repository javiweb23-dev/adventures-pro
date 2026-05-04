import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "whoWeAreTitle",
      title: "Who We Are — Heading",
      type: "localizedString",
    }),
    defineField({
      name: "whoWeAreSubtitle",
      title: "Who We Are — Subtitle",
      type: "localizedString",
    }),
    defineField({
      name: "whoWeAreBody",
      title: "Who We Are — Main content",
      type: "localizedText",
    }),
  ],
});
