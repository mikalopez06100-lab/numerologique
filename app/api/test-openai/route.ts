import { NextResponse } from 'next/server';

/**
 * Route de test pour vérifier la configuration OpenAI
 * Accès: GET /api/test-openai
 */
export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    apiKeyPresent: !!apiKey,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'Non configurée',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: process.env.OPENAI_MAX_TOKENS || '4000',
    temperature: process.env.OPENAI_TEMPERATURE || '0.7',
    envVars: {
      OPENAI_API_KEY: apiKey ? '✅ Présente' : '❌ Absente',
      OPENAI_MODEL: process.env.OPENAI_MODEL || '✅ Défaut (gpt-4o-mini)',
      OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE || '✅ Défaut (0.7)',
      OPENAI_MAX_TOKENS: process.env.OPENAI_MAX_TOKENS || '✅ Défaut (4000)',
    },
  });
}
