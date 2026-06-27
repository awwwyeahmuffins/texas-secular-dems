import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Prose pages (About + subpages, Successes). Editable in Decap CMS.
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Events collection — one entry per event.
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // free-form date label, e.g. "July 14, 2022"
    sortDate: z.coerce.date().optional(),
    location: z.string().optional(),
    upcoming: z.boolean().default(false),
  }),
});

// Endorsements collection — one entry per endorsed candidate.
const endorsements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/endorsements" }),
  schema: z.object({
    name: z.string(),
    office: z.string(),
    cycle: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { pages, events, endorsements };
