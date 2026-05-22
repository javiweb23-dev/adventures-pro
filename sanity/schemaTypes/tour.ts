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
      name: "mainTour",
      title: "Main Tour",
      type: "reference",
      to: [{ type: "tour" }],
      hidden: ({ document }) => !document?.isCombo,
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { isCombo?: boolean };
          if (doc?.isCombo && !value) return "Main tour is required for combos";
          return true;
        }),
    }),
    defineField({
      name: "comboDays",
      title: "Combo Days",
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
      hidden: ({ document }) => document?.isCombo === true,
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
      hidden: ({ document }) => document?.isCombo === true,
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { isCombo?: boolean };
          if (doc?.isCombo) return true;
          if (!value || value.length < 1) return "At least one gallery image is required";
          return true;
        }),
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
      hidden: ({ document }) => document?.isCombo === true,
    }),
    defineField({
      name: "whatToBring",
      title: "What to Bring",
      type: "localizedText",
      hidden: ({ document }) => document?.isCombo === true,
    }),
    defineField({
      name: "excludes",
      title: "Excludes",
      type: "localizedText",
      hidden: ({ document }) => document?.isCombo === true,
    }),
    defineField({
      name: "goodToKnow",
      title: "Good to Know",
      type: "localizedText",
      hidden: ({ document }) => document?.isCombo === true,
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "localizedText",
      hidden: ({ document }) => document?.isCombo === true,
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
