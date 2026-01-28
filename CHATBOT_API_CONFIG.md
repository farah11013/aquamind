# AquaMind Chatbot API Configuration

## Overview
The AquaMind Assistant chatbot uses OpenAI's GPT-3.5-turbo model to provide intelligent, context-aware responses about marine data analysis, fish species identification, oceanographic insights, and platform navigation.

## Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it will only be shown once)

### 2. Configure Environment Variable
Add your OpenAI API key to the `.env` file:

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Restart Development Server
After adding the API key, restart your development server:

```bash
npm run dev
```

## Features

### Real-Time API Integration
- Uses OpenAI GPT-3.5-turbo for natural language understanding
- Context-aware responses based on conversation history
- Marine science and platform-specific knowledge

### Fallback System
- If API fails or key is not configured, falls back to local marine-themed responses
- Ensures chatbot always provides helpful information

### System Prompt
The chatbot is configured with a specialized system prompt:
```
You are AquaMind Assistant, an AI helper for a marine data platform. 
You help users with marine data analysis, fish species identification, 
oceanographic insights, and platform navigation. Provide concise, helpful 
answers focused on marine science and the platform features.
```

## API Configuration Details

### Endpoint
```
POST https://api.openai.com/v1/chat/completions
```

### Request Parameters
- **model**: `gpt-3.5-turbo`
- **max_tokens**: 300 (concise responses)
- **temperature**: 0.7 (balanced creativity)
- **messages**: Conversation history with system prompt

### Response Handling
- Extracts assistant message from API response
- Displays in chat interface with proper formatting
- Handles errors gracefully with fallback responses

## Cost Considerations

### OpenAI Pricing (as of 2024)
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Average conversation: 200-500 tokens
- Estimated cost: $0.0004 - $0.001 per message

### Optimization
- Max tokens limited to 300 for cost efficiency
- Conversation history included for context
- System prompt optimized for concise responses

## Troubleshooting

### Chatbot Not Responding
1. Check if `VITE_OPENAI_API_KEY` is set in `.env`
2. Verify API key is valid on OpenAI platform
3. Check browser console for error messages
4. Ensure development server was restarted after adding key

### API Errors
- **401 Unauthorized**: Invalid or missing API key
- **429 Rate Limit**: Too many requests, wait and retry
- **500 Server Error**: OpenAI service issue, fallback will activate

### Fallback Mode
If API fails, the chatbot automatically uses local responses for:
- Fish species identification guidance
- Dataset analytics information
- Visualization features
- Oceanographic parameter explanations
- Platform navigation help

## Security Notes

### API Key Protection
- Never commit `.env` file to version control
- `.env` is already in `.gitignore`
- API key is only used in client-side requests
- Consider using environment-specific keys for production

### Rate Limiting
- Implement rate limiting for production use
- Monitor API usage on OpenAI dashboard
- Set up billing alerts to avoid unexpected charges

## Alternative API Providers

The chatbot can be configured to use other OpenAI-compatible APIs:

### Azure OpenAI
```typescript
const response = await fetch('https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2023-05-15', {
  headers: {
    'api-key': import.meta.env.VITE_AZURE_OPENAI_KEY,
  },
  // ... rest of config
});
```

### Local LLM (Ollama, LM Studio)
```typescript
const response = await fetch('http://localhost:11434/api/chat', {
  // Ollama-specific configuration
});
```

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify API key configuration
3. Test with fallback responses (remove API key temporarily)
4. Review OpenAI API status page

## Future Enhancements

Planned improvements:
- [ ] Conversation history persistence
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with platform data for real-time insights
- [ ] Custom fine-tuned model for marine science
- [ ] Rate limiting and usage analytics
