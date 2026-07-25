import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

// Studio configuration. Deployed as a standalone Sanity-hosted studio via
// `npx sanity deploy` → <hostname>.sanity.studio (login-gated, separate from
// the public site). No basePath: the hosted studio serves at the subdomain root.
export default defineConfig({
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
