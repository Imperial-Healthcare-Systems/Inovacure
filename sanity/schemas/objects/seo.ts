import { defineType, defineField } from "sanity";

// Per-document SEO overrides. Every field is OPTIONAL — the data layer falls
// back to sensible defaults (title, excerpt, cover image, canonical = post URL)
// so a post is fully optimised even if the editor leaves this untouched.
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Overrides the post title in search results (~60 chars).",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 2,
      description: "Overrides the excerpt for search results (~155 chars).",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "Only set to point elsewhere; defaults to this post's URL.",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Overrides the auto-generated OG image; defaults to cover.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
