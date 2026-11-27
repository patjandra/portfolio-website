import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* One markdown file per project in src/content/projects.
   `slot` (1-6) picks which scroll moment the project plays in; see README for the six moments. */
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    slot: z.number().int().min(1).max(6),
    title: z.string(),
    short: z.string(),                       // label in the side index
    org: z.string(),                         // company, course or kind of project
    role: z.string().optional(),             // position, when there is one
    dates: z.string(),                       // "Mon YYYY – Mon YYYY" or "Mon YYYY – Present"
    facts: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    tech: z.array(z.string()),
    github: z.url().optional(),
    demo: z.url().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
      kind: z.enum(['logo', 'shot', 'full']), // logo: centred on white; shot: cropped to the window; full: uncropped
    }),
  }),
});

export const collections = { projects };
