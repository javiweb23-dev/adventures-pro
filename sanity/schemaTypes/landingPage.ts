import { defineField, defineType } from "sanity";

export const landingPageType = defineType({
  name: "landingPage",
  title: "Landing Page (Slider)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título Principal",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "string",
    }),
    defineField({
      name: "sliderImages",
      title: "Imágenes del Slider",
      type: "array",
      of: [{ 
        type: "image",
        options: { hotspot: true } // Esto permite encuadrar la foto manualmente
      }],
    }),
  ],
});