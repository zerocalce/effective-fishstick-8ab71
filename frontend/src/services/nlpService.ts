/**
 * NLP Service for AI Studio Assistant
 * Handles intent recognition, sentiment analysis, and response generation.
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: string;
  latency?: number;
}

export interface NLPResponse {
  content: string;
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  latency: number;
}

const INTENTS = {
  GREETING: 'greeting',
  HELP: 'help',
  EXPLAIN_PANEL: 'explain_panel',
  DEPLOY_MODEL: 'deploy_model',
  DEBUG_CODE: 'debug_code',
  DIAGNOSTICS: 'diagnostics',
  UNKNOWN: 'unknown'
};

export const processQuery = async (query: string, context: { activePanelId: string, history: Message[] }): Promise<NLPResponse> => {
  const start = performance.now();
  
  // Simulate network/processing latency
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

  const lowerQuery = query.toLowerCase();
  let intent = INTENTS.UNKNOWN;
  let response = "";
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';

  // Basic Sentiment Analysis
  const positiveWords = ['great', 'good', 'awesome', 'thanks', 'love', 'happy', 'yes', 'help'];
  const negativeWords = ['bad', 'error', 'fail', 'broken', 'slow', 'hate', 'no', 'problem'];
  
  const posCount = positiveWords.filter(w => lowerQuery.includes(w)).length;
  const negCount = negativeWords.filter(w => lowerQuery.includes(w)).length;
  
  if (posCount > negCount) sentiment = 'positive';
  else if (negCount > posCount) sentiment = 'negative';

  // Intent Recognition
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    intent = INTENTS.GREETING;
    response = "Hello! I'm your AI Studio assistant. How can I help you build your models today?";
  } else if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
    intent = INTENTS.HELP;
    response = "I can help you explain the current panel, guide you through deployments, debug your code, or suggest best practices for your AI models.";
  } else if (lowerQuery.includes('explain') || lowerQuery.includes('this panel')) {
    intent = INTENTS.EXPLAIN_PANEL;
    response = `You are currently in the ${context.activePanelId} view. This panel is used for ${context.activePanelId === 'editor' ? 'writing code' : 'managing project resources'}.`;
  } else if (lowerQuery.includes('deploy') || lowerQuery.includes('publish')) {
    intent = INTENTS.DEPLOY_MODEL;
    response = "To deploy a model, head over to the 'Deployments' tab, select your trained model, and click 'Deploy to Cloud'.";
  } else if (lowerQuery.includes('debug') || lowerQuery.includes('error')) {
    intent = INTENTS.DEBUG_CODE;
    response = "I see you're having some trouble. Try checking the browser console or the 'Metrics' tab for detailed execution logs.";
  } else if (lowerQuery.includes('diagnostic') || lowerQuery.includes('problem') || lowerQuery.includes('health')) {
    intent = INTENTS.DIAGNOSTICS;
    response = "The system health is currently at 92/100. There are 3 active issues: a model version mismatch, an optimization suggestion for your datasets, and high memory usage in the editor worker.";
  } else {
    response = "I'm not quite sure about that. Could you rephrase? I'm specialized in AI Studio workflows and model development.";
  }

  // Personalization based on history
  if (context.history.length > 0) {
    const lastUserMsg = context.history.filter(m => m.role === 'user').pop();
    if (lastUserMsg && sentiment === 'negative') {
      response = `I'm sorry to hear you're frustrated. Let's try to fix this. ${response}`;
    }
  }

  const end = performance.now();
  
  return {
    content: response,
    intent,
    sentiment,
    latency: Math.round(end - start)
  };
};
