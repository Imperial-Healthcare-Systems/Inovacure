import { defineType, defineField } from "sanity";

// Aside / note box — renders to the site's `.hc-notebar` styling. Three tones
// map to the token palette (info=primary, success=accent, warn). No free colour.
export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Success", value: "success" },
          { title: "Warning", value: "warn" },
        ],
        layout: "radio",
      },
      initialValue: "info",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "body", tone: "tone" },
    prepare({ title, subtitle, tone }) {
      return {
        title: title || "Callout",
        subtitle: `${tone || "info"} · ${subtitle || ""}`,
      };
    },
  },
});
