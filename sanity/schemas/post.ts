import { defineType, defineField } from "sanity";

// The blog article. Reading time, table-of-contents and (default) related
// posts are COMPUTED downstream — never stored here — so there is nothing to
// keep in sync. `publishedAt` in the future keeps a post in draft state.
export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "Permanent URL segment — no dates or ids. Avoid changing it.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "One or two sentences — used on cards and as the meta description fallback.",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required(),
        },
        { name: "caption", type: "string", title: "Caption" },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "content",
      description: "Optional Q&A appended after the article; also emits FAQ rich results.",
      of: [
        {
          type: "object",
          name: "qa",
          fields: [
            { name: "question", type: "string", validation: (r) => r.required() },
            { name: "answer", type: "text", rows: 3, validation: (r) => r.required() },
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      description: "A future date keeps the post in draft (not built, noindex).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      description: "One featured post headlines the blog index.",
      initialValue: false,
    }),
    defineField({
      name: "relatedManual",
      title: "Related posts (manual override)",
      type: "array",
      group: "meta",
      description: "Optional — overrides the automatic related-posts ranking.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
      date: "publishedAt",
    },
    prepare({ title, author, media, date }) {
      const when = date ? new Date(date).toISOString().slice(0, 10) : "no date";
      return { title, subtitle: `${when}${author ? ` · ${author}` : ""}`, media };
    },
  },
});
