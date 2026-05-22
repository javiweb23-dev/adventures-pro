import { defineField, defineType } from "sanity";

type TourSlugSourceDoc = { title?: { en?: string; es?: string; frCA?: string } };

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
        source: (doc) => {
          const d = doc as TourSlugSourceDoc;
          return d.title?.en || d.title?.es || "";
        },
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
      name: "isCombo",
      title: "¿Es un Combo?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "comboItems",
      title: "Combo Items",
      type: "array",
      hidden: ({ document }) => !document?.isCombo,
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "dayLabel",
              title: "Day Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tour",
              title: "Tour",
              type: "reference",
              to: [{ type: "tour" }],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              dayLabel: "dayLabel",
              titleEn: "tour.title.en",
              titleEs: "tour.title.es",
            },
            prepare({ dayLabel, titleEn, titleEs }) {
              return {
                title: dayLabel,
                subtitle: titleEn || titleEs,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "comboComments",
      title: "Combo Comments",
      type: "localizedText",
      hidden: ({ document }) => !document?.isCombo,
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
      type: "localizedString",
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "localizedString",
    }),
    defineField({
      name: "ages",
      title: "Ages",
      type: "localizedString",
    }),
    defineField({
      name: "starts",
      title: "Starts",
      type: "localizedString",
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
      type: "localizedText",
      hidden: ({ document }) => document?.isCombo === true,
    }),
    defineField({
      name: "whatHappens",
      title: "What Happens",
      type: "localizedText",
      hidden: ({ document }) => document?.isCombo === true,
    }),
    defineField({
      name: "includes",
      title: "Includes",
      type: "localizedText",
    }),
    defineField({
      name: "excludes",
      title: "Excludes",
      type: "localizedText",
    }),
    defineField({
      name: "goodToKnow",
      title: "Good to Know",
      type: "localizedText",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "localizedText",
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
