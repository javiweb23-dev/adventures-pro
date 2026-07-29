import type { ReactNode } from "react";

function isSafeHref(href: string): boolean {
  return (
    href.startsWith("/") ||
    href.startsWith("https://api.whatsapp.com/") ||
    href.startsWith("https://wa.me/") ||
    href.startsWith("https://") ||
    href.startsWith("http://")
  );
}

function TourLink({ href, label }: { href: string; label: string }) {
  const safeHref = isSafeHref(href) ? href : "#";
  const external = safeHref.startsWith("http");
  return (
    <a
      href={safeHref}
      className="font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

/**
 * Renders assistant chat markdown with bold tour links.
 * Supports: **[Title](/path)**, [Title](/path), **bold**
 */
export function renderAssistantMarkdown(content: string): ReactNode {
  const lines = content.split("\n");
  return lines.map((line, lineIndex) => (
    <span key={`line-${lineIndex}`}>
      {lineIndex > 0 ? "\n" : null}
      {renderInline(line, lineIndex)}
    </span>
  ));
}

function renderInline(text: string, lineIndex: number): ReactNode[] {
  // Bold markdown link, plain markdown link, then bold text.
  const token =
    /(\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = token.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`t-${lineIndex}-${tokenIndex++}`}>
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    if (match[2] && match[3]) {
      // **[label](url)**
      nodes.push(
        <TourLink
          key={`l-${lineIndex}-${tokenIndex++}`}
          label={match[2]}
          href={match[3]}
        />,
      );
    } else if (match[4] && match[5]) {
      // [label](url) — still bold for tour clicks
      nodes.push(
        <TourLink
          key={`l-${lineIndex}-${tokenIndex++}`}
          label={match[4]}
          href={match[5]}
        />,
      );
    } else if (match[6]) {
      nodes.push(
        <strong key={`b-${lineIndex}-${tokenIndex++}`} className="font-bold">
          {match[6]}
        </strong>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <span key={`t-${lineIndex}-${tokenIndex++}`}>{text.slice(lastIndex)}</span>,
    );
  }

  return nodes;
}

/** True when a reply looks cut mid-markdown (unclosed tour link). */
export function looksTruncatedMarkdown(content: string): boolean {
  const openBrackets = (content.match(/\[/g) ?? []).length;
  const closeBrackets = (content.match(/\]/g) ?? []).length;
  const openParensLinks = (content.match(/\]\(/g) ?? []).length;
  const closeParens = (content.match(/\)/g) ?? []).length;
  if (openBrackets !== closeBrackets) return true;
  if (openParensLinks > closeParens) return true;
  if (/\*\*\[[^\]]*$/.test(content)) return true;
  if (/\[[^\]]*$/.test(content)) return true;
  if (/\]\([^)]*$/.test(content)) return true;
  return false;
}
