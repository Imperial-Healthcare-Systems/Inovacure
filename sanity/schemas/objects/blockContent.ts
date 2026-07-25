import { defineType, defineArrayMember } from "sanity";

// Portable Text body with a CURATED, layout-safe whitelist. Editors get rich
// structure but cannot break the design system: no raw HTML, no inline styles,
// no custom colours — only h2-h4 (h1 is the article title), lists, quote, and
// the custom blocks (image/callout/code/table/faq) defined alongside. Marks are
// limited to strong/em/inline-code plus internal/external links with normalised
// rel/target. Anything not listed here simply cannot be authored.
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Only h2-h4 + normal + blockquote. No h1 (reserved for the title).
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "internalLink",
            type: "object",
            title: "Internal link",
            fields: [
              {
                name: "reference",
                type: "reference",
                title: "Reference",
                to: [{ type: "post" }],
              },
            ],
          },
          {
            name: "link",
            type: "object",
            title: "External link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
    // Custom block-level content — each renders through a dedicated serializer.
    defineArrayMember({
      type: "image",
      name: "figure",
      title: "Image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Required — describes the image for SEO and screen readers.",
          validation: (rule) => rule.required(),
        },
        { name: "caption", type: "string", title: "Caption" },
        {
          name: "fullBleed",
          type: "boolean",
          title: "Full-bleed (wider than text)",
          initialValue: false,
        },
      ],
    }),
    defineArrayMember({ type: "callout" }),
    defineArrayMember({ type: "codeBlock" }),
    defineArrayMember({ type: "contentTable" }),
    defineArrayMember({ type: "faq" }),
  ],
});
