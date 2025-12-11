# Mock Interview Setup Guide

## Overview

The AI Mock Interview feature uses Vapi.ai to provide realistic voice-based interview practice with an AI interviewer.

## Prerequisites

1. **Vapi Account**: Sign up at [https://vapi.ai](https://vapi.ai)
2. **Node Package**: Install the Vapi web package

## Installation

### 1. Install Vapi Package

```bash
npm install @vapi-ai/web
```

### 2. Get Your Vapi Credentials

1. Go to [https://vapi.ai](https://vapi.ai) and create an account
2. Navigate to your dashboard
3. Get your **Public API Key** from the API Keys section
4. Create an **Assistant** in the Vapi dashboard:
   - Go to Assistants section
   - Click "Create Assistant"
   - Configure your assistant with interview-related prompts
   - Copy the **Assistant ID**

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_api_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
```

**Important**: Use `NEXT_PUBLIC_` prefix for client-side accessible variables in Next.js.

## Assistant Configuration

### Recommended System Prompt

When creating your Vapi assistant, use a system prompt like this:

```
You are an experienced technical interviewer conducting a mock interview. Your role is to:

1. Start by introducing yourself and asking about the candidate's background
2. Ask relevant technical questions based on their experience level
3. Ask follow-up questions to dive deeper into their answers
4. Be professional but friendly
5. Provide constructive feedback when appropriate
6. Cover topics like:
   - Technical skills and experience
   - Problem-solving abilities
   - Past projects and achievements
   - System design (for senior roles)
   - Behavioral questions

Keep responses concise and natural. Wait for the candidate to finish speaking before responding.
```

### Voice Settings

- **Voice**: Choose a professional, clear voice
- **Response Delay**: 800-1000ms (allows natural conversation flow)
- **Interruption Sensitivity**: Medium (allows candidate to speak freely)

## Features

### Current Implementation

✅ **Voice Interview**

- Real-time voice conversation with AI
- Natural speech recognition
- Clear audio output

✅ **Live Transcript**

- Real-time conversation transcript
- Separate styling for interviewer and candidate
- Timestamps for each message

✅ **Interview Controls**

- Start/Stop interview
- Mute/Unmute microphone
- Duration timer
- Question counter

✅ **User Interface**

- Responsive design for all devices
- Dark mode support
- Professional interview environment
- Real-time status indicators

### Usage

1. Click "Start Mock Interview" on the main page
2. Allow microphone permissions when prompted
3. Click "Start Interview" to begin
4. Speak naturally with the AI interviewer
5. View real-time transcript on the right panel
6. Use controls to mute or end the interview
7. Click "End Interview" when finished

## Troubleshooting

### Microphone Not Working

- Check browser permissions
- Ensure microphone is not used by another application
- Try refreshing the page

### No Response from AI

- Verify your Vapi API key is correct
- Check that the Assistant ID is valid
- Ensure you have credits in your Vapi account

### Audio Quality Issues

- Check your internet connection
- Close other bandwidth-intensive applications
- Try using a headset for better audio quality

## File Structure

```
src/app/home/mockinterview/
├── page.js                          # Main page with interview welcome
└── components/
    └── VapiInterview.jsx           # Vapi interview component
```

## Customization

### Modify Interview Type

In `page.js`, customize the interview settings:

```javascript
<VapiInterview
  apiKey={VAPI_API_KEY}
  assistantId={VAPI_ASSISTANT_ID}
  interviewTitle="Your Custom Title"
  interviewRole="Your Custom Role"
/>
```

### Styling

The component uses Tailwind CSS and shadcn/ui components. Customize styles in:

- `VapiInterview.jsx` - Main interview interface
- `page.js` - Welcome screen

## Cost Considerations

Vapi charges based on:

- **Conversation minutes**: Per minute of audio
- **API calls**: Per request made

Check [Vapi Pricing](https://vapi.ai/pricing) for current rates.

## Best Practices

1. **Test First**: Test with short conversations before production
2. **Monitor Usage**: Keep track of API usage and costs
3. **Error Handling**: The component includes comprehensive error handling
4. **User Experience**: Ensure users understand microphone permissions are required
5. **Feedback Loop**: Collect user feedback to improve the assistant's prompts

## Security

- Never expose your Vapi secret keys in client-side code
- Only use public API keys with `NEXT_PUBLIC_` prefix
- Implement rate limiting for production use
- Monitor usage for abuse

## Support

For issues with:

- **Vapi Platform**: [Vapi Documentation](https://docs.vapi.ai)
- **This Implementation**: Check console logs for detailed error messages

## Future Enhancements

Potential features to add:

- [ ] Multiple interview types (technical, behavioral, etc.)
- [ ] Interview recording and playback
- [ ] Automated feedback and scoring
- [ ] Interview history and analytics
- [ ] Custom question banks
- [ ] Multi-round interviews

## License

This implementation follows your project's license terms.
