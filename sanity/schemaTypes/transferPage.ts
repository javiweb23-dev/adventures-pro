import { defineField, defineType } from "sanity";

export const transferPageType = defineType({
  name: "transferPage",
  title: "Transfer Page",
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
      title: "Título principal del cuadro de presentación",
      type: "localizedString",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtítulo o descripción corta",
      type: "localizedString",
    }),
  ],
});
