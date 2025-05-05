import z from 'zod';

import { aiSchema } from './ai.schema';
import { localeCodeSchema } from './locales';

export const localeSchema = z.object({
  source: localeCodeSchema,
  targets: z.array(localeCodeSchema),
});

export const configSchema = z.object({
  ai: aiSchema,
  filePatterns: z.string(),
  locales: localeSchema,
  localeRules: z.record(localeCodeSchema, z.array(z.string())).optional(),
});

export type ConfigSchema = z.input<typeof configSchema>;

export const defaultConfig: ConfigSchema = {
  ai: {
    provider: 'anthropic',
    model: 'claude-3-7-sonnet-20250219',
  },
  locales: {
    source: 'en',
    targets: ['ko'],
  },
  filePatterns: 'json/[locale].json',
  localeRules: {
    ko: ['write the sentence in 해요 style.'],
  },
};
