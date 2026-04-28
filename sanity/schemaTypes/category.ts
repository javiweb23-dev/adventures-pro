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
        // Usamos 'any' para el documento para evitar errores de tipado en el build de Vercel
        source: (doc: any) => {
          // Intenta obtener el título en inglés, si no existe usa el español, o un string vacío
          const title = doc.title?.en || doc.title?.es || "";
          return title;
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