import { defineField, defineType } from "sanity";

export const tourType = defineType({
  name: "tour",
  title: "Tour",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: any) => doc.title?.en || doc.title?.es || "",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "price",
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "listingImage",
      title: "Listing Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "highlightBadge",
      title: "Highlight Badge",
      type: "string",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
    }),
    defineField({
      name: "ages",
      title: "Ages",
      type: "string",
    }),
    defineField({
      name: "starts",
      title: "Starts",
      type: "string",
    }),
    defineField({
      name: "peekProId",
      title: "PeekPro ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "infoTour",
      title: "Info Tour",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "program",
      title: "What Happens in the Program",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "whatToBring",
      title: "What to Bring",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "whatsIncluded",
      title: "What's Included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "goodToKnow",
      title: "Good to Know",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleEs: "title.es",
      titleFr: "title.frCA",
      slug: "slug.current",
      currency: "currency",
    },
    prepare({ titleEn, titleEs, titleFr, slug, currency }) {
      const title = titleEn || titleEs || titleFr || "Untitled tour";
      const subtitleParts = [slug ? `/${slug}` : "", currency || ""].filter(Boolean);
      return {
        title,
        subtitle: subtitleParts.join(" • "),
      };
    },
  },
});
