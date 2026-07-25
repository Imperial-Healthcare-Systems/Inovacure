import { defineType, defineField } from "sanity";

// In-body FAQ block. Renders to the site's native <details> accordion styling
// (`.hc-faqitem`) AND feeds FAQPage JSON-LD so questions can win rich results.
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        {
          type: "object",
          name: "qa",
          fields: [
            {
              name: "question",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "answer",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      return { title: "FAQ", subtitle: `${(items || []).length} questions` };
    },
  },
});
