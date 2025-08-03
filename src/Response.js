// Response.js - Simplified with working alternatives

// Mock AI responses for testing (remove when real API is working)
const mockResponses = [
  "That's a great question! I'd love to help you with that.",
  "Interesting point! Can you tell me more about what you're thinking?",
  "I understand what you're asking. Let me share my thoughts on that.",
  "Thanks for sharing that with me. Here's what I think...",
  "That's definitely something worth discussing. What's your perspective?",
  "I see where you're coming from. Have you considered this angle?",
  "Great topic! I'd be happy to explore that with you.",
  "That reminds me of something interesting. Would you like to hear about it?",
  "You've raised an important point. Let me think about that...",
  "I appreciate you bringing that up. Here's my take on it."
];

// Simple pattern-based responses
function getContextualResponse(userPrompt) {
  const prompt = userPrompt.toLowerCase();
  
  if (prompt.includes('hello') || prompt.includes('hi') || prompt.includes('hey')) {
    return "Hello! It's great to chat with you. What's on your mind today?";
  }
  
  if (prompt.includes('how are you') || prompt.includes('how do you feel')) {
    return "I'm doing well, thank you for asking! I'm here and ready to help. How are you doing?";
  }
  
  if (prompt.includes('what') && prompt.includes('name')) {
    return "I'm your AI assistant! You can call me whatever you'd like. What would you prefer to call me?";
  }
  
  if (prompt.includes('help') || prompt.includes('assist')) {
    return "I'm here to help! I can answer questions, have conversations, help with problem-solving, or just chat. What would you like to explore?";
  }
  
  if (prompt.includes('thank')) {
    return "You're very welcome! I'm happy I could help. Is there anything else you'd like to discuss?";
  }
  
  if (prompt.includes('bye') || prompt.includes('goodbye') || prompt.includes('see you')) {
    return "Goodbye! It was lovely chatting with you. Feel free to come back anytime!";
  }
  
  // Default contextual responses
  const responses = [
    `That's interesting! Tell me more about your thoughts on "${userPrompt}".`,
    `I can see why you're thinking about "${userPrompt}". What sparked this question?`,
    `"${userPrompt}" is definitely worth exploring. What specific aspect interests you most?`,
    `Thanks for bringing up "${userPrompt}". I'd love to dive deeper into this with you.`,
    `You've touched on something important with "${userPrompt}". What's your experience with this?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Mock API call with realistic delay
export async function getBotReply(userPrompt) {
  console.log('Using mock AI responses (HuggingFace API unavailable)');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
  
  // Use contextual responses for better conversation
  return getContextualResponse(userPrompt);
}

// Alternative: Try HuggingFace with better error handling
export async function tryHuggingFaceAPI(userPrompt) {
  const API_KEY = import.meta.env.VITE_HF_API_KEY;
  
  if (!API_KEY) {
    throw new Error('HuggingFace API key not found');
  }

  // Try a simple text generation model that might work
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        inputs: userPrompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    if (response.status === 503) {
      const data = await response.json();
      throw new Error(`Model loading. Wait ${data.estimated_time || 20} seconds.`);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    
    throw new Error('No response generated');
    
  } catch (error) {
    console.warn('HuggingFace API failed:', error.message);
    throw error;
  }
}

// Main function with fallbacks
export async function getBotReplyWithFallback(userPrompt) {
  // For now, skip HuggingFace and use mock responses
  // Uncomment the try block below when you want to test HuggingFace again
  
  /*
  try {
    return await tryHuggingFaceAPI(userPrompt);
  } catch (error) {
    console.warn('HuggingFace failed, using mock response:', error.message);
  }
  */
  
  // Use mock responses for reliable testing
  return await getBotReply(userPrompt);
}

// Instructions for working alternatives
export const API_ALTERNATIVES = {
  openai: {
    name: "OpenAI GPT API",
    url: "https://openai.com/api/",
    free: false,
    note: "Most reliable, requires paid account"
  },
  cohere: {
    name: "Cohere API", 
    url: "https://cohere.ai/",
    free: "Limited free tier",
    note: "Good free tier for testing"
  },
  anthropic: {
    name: "Anthropic Claude API",
    url: "https://www.anthropic.com/api",
    free: "Limited free tier", 
    note: "High quality responses"
  },
  local: {
    name: "Ollama (Local)",
    url: "https://ollama.ai/",
    free: true,
    note: "Run models locally, completely free"
  }
};

console.log('📝 HuggingFace Inference API appears to have changed.');
console.log('🔄 Currently using mock responses for testing.');
console.log('🚀 For production, consider these alternatives:', API_ALTERNATIVES);

