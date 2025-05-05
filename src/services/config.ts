import fs from 'node:fs';
import path from 'node:path';
import { type ConfigSchema, configSchema } from 'src/specs';
import * as z from 'zod';

export const CONFIG_FILE = 'ai-translator.config.json';
const configFilePath = path.join(process.cwd(), CONFIG_FILE);

export async function loadConfig(): Promise<ConfigSchema | null> {
  const env = getEnv();
  const CONFIG_FILEExists = fs.existsSync(configFilePath);
  if (!CONFIG_FILEExists) {
    return null;
  }

  const fileContents = fs.readFileSync(configFilePath, 'utf8');

  const rawConfig = JSON.parse(fileContents);
  rawConfig.ai = {
    ...rawConfig.ai,
    ...(rawConfig.ai.provider === 'amazon-bedrock' && {
      ...(env.AWS_ACCESS_KEY_ID && {
        access_key_id: env.AWS_ACCESS_KEY_ID,
      }),
      ...(env.AWS_SECRET_ACCESS_KEY && {
        secret_access_key: env.AWS_SECRET_ACCESS_KEY,
      }),
      ...(env.AWS_REGION && {
        region: env.AWS_REGION,
      }),
    }),
    ...(rawConfig.ai.provider === 'anthropic' && {
      ...(env.ANTHROPIC_API_KEY && {
        api_key: env.ANTHROPIC_API_KEY,
      }),
    }),
    ...(rawConfig.ai.provider === 'azure' && {
      ...(env.AZURE_API_KEY && {
        api_key: env.AZURE_API_KEY,
      }),
    }),
    ...(rawConfig.ai.provider === 'deepseek' && {
      api_key: env.DEEPSEEK_API_KEY,
    }),
    ...(rawConfig.ai.provider === 'openai' && {
      api_key: env.OPENAI_API_KEY,
    }),
  };

  const config = configSchema.parse(rawConfig);
  return config;
}

export async function saveConfig(config: ConfigSchema) {
  const serialized = JSON.stringify(config, null, 2);
  fs.writeFileSync(configFilePath, serialized);
  return config;
}

function getEnv() {
  return z
    .object({
      // Amazon Bedrock
      AWS_ACCESS_KEY_ID: z.string().optional(),
      AWS_SECRET_ACCESS_KEY: z.string().optional(),
      AWS_REGION: z.string().optional(),
      // Authropic
      ANTHROPIC_API_KEY: z.string().optional(),
      // Azure
      AZURE_API_KEY: z.string().optional(),
      // DeepSeek
      DEEPSEEK_API_KEY: z.string().optional(),
      // OpenAI
      OPENAI_API_KEY: z.string().optional(),
    })
    .passthrough()
    .parse(process.env);
}
