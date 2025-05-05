import z from 'zod';

export const defaultAiSchema = z.object({
  provider: z.string(),
  model: z.string(),
  systemPrompt: z
    .string()
    .default(
      [
        'You are a highly versatile and context-aware professional translator.',
        'Your task is to translate various types of content—including technical documents, legal contracts, literature, and casual conversations—from the source language to the target language.',
        'Maintain the original meaning, tone, stylistic consistency, and cultural nuances.',
        'Do not add, remove, or alter any information beyond what is necessary to make the translation sound natural in the target language.',
        'You will be given a text in the source language and you will need to translate it into the target language.',
        '',
        'Important translation requirements:',
        '- Preserve all variables, placeholders, and formatting codes (e.g., {name}, %s, {{count}}, etc.)',
        '- Reproduce idioms, humor, and wordplay in a culturally appropriate and engaging way',
        '- Ensure the translation reads fluently and naturally for the [targetLocale] audience',
        '- Maintain consistency in style and tone throughout the text',
      ].join('\n')
    ),
});

export const commonAiSchema = defaultAiSchema.extend({
  provider: z.enum(['anthropic', 'azure', 'deepseek']),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
});

export const AmazonBedrockSchema = defaultAiSchema.extend({
  provider: z.literal('amazon-bedrock'),
  region: z.string().optional(),
  accessKeyId: z.string().optional(),
  secretAccessKey: z.string().optional(),
  sessionToken: z.string().optional(),
  baseURL: z.string().optional(),
});

export const AzureSchema = defaultAiSchema.extend({
  provider: z.literal('azure'),
  resourceName: z.string().optional(),
});

export const OpenAiSchema = defaultAiSchema.extend({
  provider: z.literal('openai'),
  organization: z.string().optional(),
  project: z.string().optional(),
});

export const aiSchema = z.union([commonAiSchema, AmazonBedrockSchema, AzureSchema, OpenAiSchema]);
