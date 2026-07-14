import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagen del Cuadro de Presentación",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroTitle",
      title: "Título principal del banner",
      type: "localizedString",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtítulo descriptivo corto",
      type: "localizedString",
    }),
  ],
});
