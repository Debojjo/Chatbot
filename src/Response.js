export async function getBotReply(userPrompt) {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!API_KEY) {
    throw new Error('Groq API key not found');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Keep responses concise, friendly, and engaging.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        model: 'llama3-8b-8192',
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
}

function getSmartFallbackResponse(userPrompt) {
  const prompt = userPrompt.toLowerCase();
  
  if (prompt.includes('hello') || prompt.includes('hi') || prompt.includes('hey')) {
    return "Hello! It's great to chat with you. What's on your mind today?";
  }
  
  if (prompt.includes('how are you')) {
    return "I'm doing well, thank you for asking! I'm here and ready to help. How are you doing?";
  }
  
  if (prompt.includes('help') || prompt.includes('assist')) {
    return "I'm here to help! I can answer questions, have conversations, or just chat. What would you like to explore?";
  }
  
  if (prompt.includes('thank')) {
    return "You're very welcome! I'm happy I could help. Is there anything else you'd like to discuss?";
  }
  
  if (prompt.includes('what') && prompt.includes('name')) {
    return "I'm your AI assistant! You can call me whatever you'd like. What would you prefer to call me?";
  }
  
  if (prompt.includes('bye') || prompt.includes('goodbye')) {
    return "Goodbye! It was lovely chatting with you. Feel free to come back anytime!";
  }
  
  const responses = [
    `That's interesting! Tell me more about your thoughts on "${userPrompt}".`,
    `I can see why you're thinking about "${userPrompt}". What sparked this question?`,
    `"${userPrompt}" is definitely worth exploring. What specific aspect interests you most?`,
    `Thanks for bringing up "${userPrompt}". I'd love to dive deeper into this with you.`,
    `You've touched on something important with "${userPrompt}". What's your experience with this?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function getBotReplyWithFallback(userPrompt) {
  try {
    return await getBotReply(userPrompt);
  } catch (error) {
    console.warn('Groq API failed, using fallback response:', error.message);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getSmartFallbackResponse(userPrompt);
  }
}

