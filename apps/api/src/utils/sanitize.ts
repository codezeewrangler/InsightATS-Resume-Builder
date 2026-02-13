import sanitizeHtml from 'sanitize-html';

export const sanitizeText = (value: string) =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });

export const sanitizeObject = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return sanitizeText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, sanitizeObject(val)]),
    );
  }

  return value;
};
