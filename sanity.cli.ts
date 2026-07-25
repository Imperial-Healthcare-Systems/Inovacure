import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

// Used by the Sanity CLI for TypeGen:
//   npx sanity@latest schema extract
//   npx sanity@latest typegen generate
// Config lives in sanity-typegen.json (query + schema paths).
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
