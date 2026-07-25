import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

// Studio configuration, deployed as a standalone Sanity-hosted studio via
// `npx sanity deploy` → <hostname>.sanity.studio (login-gated, separate from
// the public site). No basePath: the hosted studio serves at the subdomain root.
//
// projectId/dataset are hardcoded fallbacks (they are PUBLIC values, also
// shipped in the site bundle). This is required because the deployed studio
// runs in the browser, where only SANITY_STUDIO_*-prefixed env vars are
// inlined — the NEXT_PUBLIC_* ones the site uses are NOT, so relying on them
// alone throws "Configuration must contain projectId" at runtime.
export default defineConfig({
  projectId: projectId || "1lhrxq6h",
  dataset: dataset || "production",
  schema: { types: schemaTypes },
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion || "2024-10-01" }),
  ],
});
