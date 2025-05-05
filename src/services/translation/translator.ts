import { type AmazonBedrockProviderSettings, createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { type AnthropicProviderSettings, createAnthropic } from '@ai-sdk/anthropic';
import { type AzureOpenAIProviderSettings, createAzure } from '@ai-sdk/azure';
import { type DeepSeekProviderSettings, createDeepSeek } from '@ai-sdk/deepseek';
import { type OpenAIProviderSettings, createOpenAI } from '@ai-sdk/openai';
import { type LanguageModelV1, generateText } from 'ai';

import type { ConfigSchema } from 'src/specs';

// Helper function to initialize the model
function initializeModel(config: ConfigSchema['ai']): LanguageModelV1 {
  const { provider, model, ...restAIConfig } = config;
  switch (provider) {
    case 'amazon-bedrock':
      return createAmazonBedrock(restAIConfig as AmazonBedrockProviderSettings)(model);
    case 'anthropic':
      return createAnthropic(restAIConfig as AnthropicProviderSettings)(model);
    case 'azure':
      return createAzure(restAIConfig as AzureOpenAIProviderSettings)(model);
    case 'deepseek':
      return createDeepSeek(restAIConfig as DeepSeekProviderSettings)(model);
    case 'openai':
      return createOpenAI(restAIConfig as OpenAIProviderSettings)(model);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Creates a translator based on the specified provider configuration.
 * @param providerConfig - The AI provider configuration.
 * @returns An object with a translate method.
 */
export function createTranslator(providerConfig: ConfigSchema['ai']) {
  const model = initializeModel(providerConfig);
  const systemPrompt = providerConfig.systemPrompt as string;

  /**
   * Translates the given context based on the specified locales and rules.
   * @param input - The translation input containing locales, rules, and context.
   * @returns The translation result including the translated context, usage stats, and provider metadata.
   */
  async function translate(input: {
    sourceLocale: string;
    targetLocale: string;
    localeRules: string[];
    context: Record<string, unknown>;
  }) {
    const { sourceLocale, targetLocale, localeRules, context } = input;

    let prompt = systemPrompt.replaceAll('{source}', sourceLocale).replaceAll('{target}', targetLocale); // Use systemPrompt from the closure

    if (localeRules.length > 0) {
      prompt += `Special instructions for ${targetLocale}:\n`;
      prompt += localeRules.join('\n');
    }

    const result = await generateText({
      model: model, // Use the model from the closure
      messages: [
        {
          role: 'system',
          content: JSON.stringify({
            role: 'system',
            content: prompt,
          }),
        },
        {
          role: 'user',
          content: JSON.stringify({
            sourceLocale: 'ja',
            targetLocale: 'ko',
            data: {
              message: '質問、恋って何でしょうか？',
            },
          }),
        },
        {
          role: 'assistant',
          content: JSON.stringify({
            sourceLocale: 'ja',
            targetLocale: 'ko',
            data: {
              message: '질문, 사랑이란 무엇일까요?',
            },
          }),
        },
        {
          role: 'user',
          content: JSON.stringify({
            sourceLocale: sourceLocale,
            targetLocale: targetLocale,
            data: context,
          }),
        },
      ],
    });

    return {
      context: result.text,
      usage: result.usage,
      reasoning: result.reasoning,
      providerMetadata: result.providerMetadata,
    };
  }

  return {
    translate,
  };
}
