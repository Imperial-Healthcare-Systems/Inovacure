import { defineCliConfig } from "sanity/cli";

// Used by the Sanity CLI (TypeGen + `sanity deploy`). projectId/dataset are
// public values (also shipped in the browser bundle), so a hardcoded fallback
// is safe and lets `npx sanity deploy` work in a bare terminal without loading
// the Next env files. Env vars still override for other environments.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1lhrxq6h",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  autoUpdates: true,
});
