import type { SchemaTypeDefinition } from "sanity";

import { post } from "./post";
import { author } from "./author";
import { category } from "./category";
import { tag } from "./tag";
import { blockContent } from "./objects/blockContent";
import { callout } from "./objects/callout";
import { codeBlock } from "./objects/codeBlock";
import { contentTable } from "./objects/contentTable";
import { faq } from "./objects/faq";
import { seo } from "./objects/seo";

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  post,
  author,
  category,
  tag,
  // objects
  blockContent,
  callout,
  codeBlock,
  contentTable,
  faq,
  seo,
];
