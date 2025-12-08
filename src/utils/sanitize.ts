import DOMPurify from "dompurify"

export const sanitizeDaoName = (text: string | null | undefined): string => {
  if (!text || typeof text !== "string") return ""

  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })

  return sanitized.trim()
}

export const sanitizeDaoDescription = (html: string | null | undefined): string => {
  if (!html || typeof html !== "string") return ""

  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })

  return sanitized.trim()
}

export const sanitizeDaoSymbol = (text: string | null | undefined): string => {
  if (!text || typeof text !== "string") return ""

  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })

  // Only allow alphabetic characters, limit to 8 characters, trim whitespace
  return sanitized
    .replace(/[^a-zA-Z]/g, "")
    .trim()
    .slice(0, 8)
}
