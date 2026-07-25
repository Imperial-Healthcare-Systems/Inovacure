import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import Link from "next/link";
import SanityImage from "./SanityImage";
import type { CoverImage, SanityImageRef } from "@/lib/blog/types";

// Body renderer. Every Portable Text block/mark/type maps to a controlled
// element styled by `.hc-prose` (globals tokens) — nothing an editor writes can
// escape the design system. Heading ids come from the shared idByKey map so
// the TOC anchors always match.

type CalloutValue = { tone?: "info" | "success" | "warn"; title?: string; body: string };
type CodeValue = { language?: string; filename?: string; code: string };
type TableValue = { hasHeader?: boolean; rows?: { cells?: string[] }[] };
type FaqValue = { items?: { question: string; answer: string }[] };
type FigureValue = SanityImageRef & { caption?: string; fullBleed?: boolean };

function Heading({
  as: Tag,
  id,
  children,
}: {
  as: "h2" | "h3";
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag id={id}>
      {id && (
        <a href={`#${id}`} className="hc-h-anchor" aria-label="Link to this section">
          #
        </a>
      )}
      {children}
    </Tag>
  );
}

function Callout({ value }: { value: CalloutValue }) {
  return (
    <div className={`hc-callout is-${value.tone ?? "info"}`} data-reveal>
      {value.title && <b>{value.title}</b>}
      <p>{value.body}</p>
    </div>
  );
}

function CodeBlock({ value }: { value: CodeValue }) {
  return (
    <figure className="hc-code">
      {value.filename && <figcaption className="hc-code-name">{value.filename}</figcaption>}
      <pre data-language={value.language ?? "text"}>
        <code>{value.code}</code>
      </pre>
    </figure>
  );
}

function ContentTable({ value }: { value: TableValue }) {
  const rows = value.rows ?? [];
  if (!rows.length) return null;
  const [head, ...rest] = value.hasHeader ? rows : [null, ...rows];
  return (
    <div className="hc-prose-tablewrap">
      <table>
        {head && (
          <thead>
            <tr>
              {(head.cells ?? []).map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rest.map((row, ri) => (
            <tr key={ri}>
              {(row?.cells ?? []).map((c, ci) => (
                <td key={ci}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqBlock({ value }: { value: FaqValue }) {
  const items = value.items ?? [];
  if (!items.length) return null;
  return (
    <div className="hc-faqlist hc-prose-faq" data-reveal>
      {items.map((f, i) => (
        <details className="hc-faqitem" name="hc-prose-faq" key={i}>
          <summary>
            {f.question}
            <span className="hc-faqmark" aria-hidden="true">
              +
            </span>
          </summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export default function PortableTextBody({
  value,
  idByKey,
}: {
  value: PortableTextBlock[];
  idByKey: Record<string, string>;
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
      h2: ({ children, value }) => (
        <Heading as="h2" id={idByKey[value._key ?? ""]}>
          {children}
        </Heading>
      ),
      h3: ({ children, value }) => (
        <Heading as="h3" id={idByKey[value._key ?? ""]}>
          {children}
        </Heading>
      ),
      h4: ({ children }) => <h4>{children}</h4>,
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      code: ({ children }) => <code>{children}</code>,
      link: ({ children, value }) => (
        <a href={value?.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      internalLink: ({ children, value }) =>
        value?.slug ? (
          <Link href={`/blog/${value.slug}`}>{children}</Link>
        ) : (
          <>{children}</>
        ),
    },
    types: {
      figure: ({ value }: { value: FigureValue }) => (
        <figure className={value.fullBleed ? "hc-figure is-wide" : "hc-figure"}>
          <SanityImage
            image={value as CoverImage}
            sizes={value.fullBleed ? "100vw" : "(max-width: 760px) 100vw, 680px"}
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ),
      callout: ({ value }: { value: CalloutValue }) => <Callout value={value} />,
      codeBlock: ({ value }: { value: CodeValue }) => <CodeBlock value={value} />,
      contentTable: ({ value }: { value: TableValue }) => (
        <ContentTable value={value} />
      ),
      faq: ({ value }: { value: FaqValue }) => <FaqBlock value={value} />,
    },
    hardBreak: () => <br />,
  };

  return <PortableText value={value} components={components} />;
}
