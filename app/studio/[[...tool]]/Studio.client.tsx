"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

// Client wrapper for the embedded Studio SPA. NextStudio handles the full
// viewport, metadata and font loading. The surrounding root layout adds no
// site chrome (it only renders <body>{children}</body>). The route that mounts
// this is env-gated + noindex (see page.tsx).
export default function StudioRoot() {
  return <NextStudio config={config} />;
}
