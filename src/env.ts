const required = [
  "NOTION_TOKEN",
  "NOTION_DEALFLOW_DB",
  "NOTION_SIGNAL_DB",
  "NOTION_THESIS_PACK_PAGE",
  "NOTION_BLOG_DB",
] as const;

type Required = (typeof required)[number];

function read(): Record<Required, string> {
  const missing: string[] = [];
  const out = {} as Record<Required, string>;
  for (const key of required) {
    const v = process.env[key];
    if (!v) missing.push(key);
    else out[key] = v;
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required env vars: ${missing.join(", ")}. Copy .env.example to .env.local and fill them in.`,
    );
  }
  return out;
}

export const env = {
  get: read,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
