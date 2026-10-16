import DOMPurify from "dompurify"

/**
 * The one HTML allowlist for user-written content rendered in the app
 * (poll and community descriptions, proposal descriptions, forum posts).
 * Formatting survives; anything that can run script or embed a document
 * (iframe, srcdoc, event handlers, javascript: URLs, forms) does not.
 */
const ALLOWED_TAGS = [
  "a",
  "b",
  "i",
  "u",
  "em",
  "strong",
  "strike",
  "s",
  "p",
  "br",
  "hr",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "code",
  "pre",
  "span",
  "div",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "caption",
  "figure",
  "figcaption",
  "details",
  "summary"
]

const ALLOWED_ATTR = ["href", "target", "rel", "class", "src", "alt", "title", "width", "height", "colspan", "rowspan"]

const FORBID_TAGS = [
  "iframe",
  "script",
  "style",
  "form",
  "input",
  "button",
  "object",
  "embed",
  "base",
  "svg",
  "math",
  "link",
  "meta"
]

let hooked = false
const ensureHooks = () => {
  if (hooked) return
  hooked = true
  // Images may only come from http(s); links open in a new tab without a referrer.
  DOMPurify.addHook("afterSanitizeAttributes", node => {
    if (node.tagName === "IMG") {
      const src = node.getAttribute("src") || ""
      if (!/^https?:\/\//i.test(src)) node.removeAttribute("src")
    }
    if (node.tagName === "A") {
      const href = node.getAttribute("href") || ""
      if (href && !/^(https?:\/\/|mailto:|#)/i.test(href)) node.removeAttribute("href")
      node.setAttribute("target", "_blank")
      node.setAttribute("rel", "nofollow noopener noreferrer")
    }
  })
}

export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return ""
  ensureHooks()
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  })
}

/** Plain text of user-written HTML, for previews and truncation. */
export const stripHtml = (html: string | null | undefined): string => {
  const safe = sanitizeHtml(html)
  if (!safe) return ""
  const doc = new DOMParser().parseFromString(safe, "text/html")
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim()
}

/** A URL safe to put in an href, or undefined. */
export const safeHref = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : undefined
  } catch {
    return undefined
  }
}
