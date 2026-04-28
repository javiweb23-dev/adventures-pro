import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
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
        source: (doc: Record<string, unknown>) => {
          const title = doc.title as Record<string, unknown> | undefined;
          const primary = title?.en;
          return typeof primary === "string" ? primary : "";
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleEs: "title.es",
      titleFr: "title.frCA",
      slug: "slug.current",
    },
    prepare({ titleEn, titleEs, titleFr, slug }) {
      const title = titleEn || titleEs || titleFr || "Untitled category";
      return {
        title,
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
