import { defineType, defineField } from "sanity";

// Simple table: an optional header row + body rows, each a list of cell strings.
// Kept plain (no plugin) and renders into an overflow-scrolling `.hc-prose table`.
export const contentTable = defineType({
  name: "contentTable",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "hasHeader",
      title: "First row is a header",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "row",
          fields: [
            {
              name: "cells",
              title: "Cells",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              return { title: (cells || []).join(" · ") || "Row" };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { rows: "rows" },
    prepare({ rows }) {
      return { title: "Table", subtitle: `${(rows || []).length} rows` };
    },
  },
});
