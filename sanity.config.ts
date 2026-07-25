"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

// Embedded Studio configuration (mounted at /studio, env-gated). The Studio is
// only ever reached with SANITY_STUDIO_ENABLED === "true" AND a valid project
// id, so an empty projectId here is harmless at build time.
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
