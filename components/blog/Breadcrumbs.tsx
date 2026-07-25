import { Fragment } from "react";

// Reuses the site's `.hc-crumb` breadcrumb (designed for the dark pagehead).
export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="hc-crumb" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && " · "}
          {it.href ? <a href={it.href}>{it.label}</a> : <b>{it.label}</b>}
        </Fragment>
      ))}
    </nav>
  );
}
