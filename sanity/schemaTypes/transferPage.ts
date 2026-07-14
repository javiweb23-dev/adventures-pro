import { defineArrayMember, defineField, defineType } from "sanity";

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

    defineField({
      name: "whyUsTitle",
      title: "Why Us — Título de la sección",
      type: "localizedString",
    }),
    defineField({
      name: "whyUsCards",
      title: "Why Us — Tarjetas",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "whyUsCard",
          title: "Tarjeta",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "localizedString",
            }),
            defineField({
              name: "description",
              title: "Descripción",
              type: "localizedText",
            }),
            defineField({
              name: "icon",
              title: "Ícono",
              type: "string",
              description:
                "Identificador del ícono (ej: dollar, shield, clock, car, star, users)",
            }),
          ],
          preview: {
            select: { title: "title.en", subtitle: "icon" },
          },
        }),
      ],
    }),

    defineField({
      name: "airportsTitle",
      title: "Airports — Título de la sección",
      type: "localizedString",
    }),
    defineField({
      name: "airportsSubtitle",
      title: "Airports — Subtítulo",
      type: "localizedText",
    }),

    defineField({
      name: "ctaTitle",
      title: "CTA — Título del banner",
      type: "localizedString",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA — Descripción",
      type: "localizedText",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA — Texto del botón",
      type: "localizedString",
    }),

    defineField({
      name: "faqsTitle",
      title: "FAQs — Título de la sección",
      type: "localizedString",
    }),
    defineField({
      name: "faqsSubtitle",
      title: "FAQs — Subtítulo",
      type: "localizedText",
    }),
    defineField({
      name: "faqsList",
      title: "FAQs — Lista de preguntas",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "Pregunta",
          fields: [
            defineField({
              name: "question",
              title: "Pregunta",
              type: "localizedString",
            }),
            defineField({
              name: "answer",
              title: "Respuesta",
              type: "localizedText",
            }),
          ],
          preview: {
            select: { title: "question.en" },
          },
        }),
      ],
    }),
  ],
});
