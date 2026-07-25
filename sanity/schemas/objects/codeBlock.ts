import { defineType, defineField } from "sanity";

// Fenced code block. A plain object (language + code + optional filename) rather
// than @sanity/code-input, to avoid an extra heavy Studio dependency; renders to
// the `.hc-prose pre` styling. Syntax highlighting can be layered later.
export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          "text",
          "bash",
          "json",
          "javascript",
          "typescript",
          "tsx",
          "html",
          "css",
          "sql",
        ].map((l) => ({ title: l, value: l })),
      },
      initialValue: "text",
    }),
    defineField({ name: "filename", title: "Filename", type: "string" }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: "language", filename: "filename" },
    prepare({ language, filename }) {
      return { title: filename || "Code block", subtitle: language || "text" };
    },
  },
});
