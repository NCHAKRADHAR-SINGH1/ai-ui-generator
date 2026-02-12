import OpenAI from 'openai';

export class Explainer {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
    });
  }

  async explain(plan: any, originalIntent: string, isModification: boolean): Promise<string> {
    // If no API key, return mock explanation
    if (!process.env.OPENAI_API_KEY) {
      if (originalIntent.includes('dashboard')) {
        return "I created a comprehensive dashboard with a sidebar navigation, key metrics cards, a sales chart, and a recent orders table. The three-column layout for metrics gives you at-a-glance insights, while the chart helps visualize trends. I added a user table with status badges for easy data management.";
      } else if (originalIntent.includes('login')) {
        return "I built a clean, centered login form with email and password fields. The card includes 'Remember me' functionality, a password reset link, and social login options. The gradient background and shadow create depth and focus on the login card.";
      } else if (originalIntent.includes('table')) {
        return "I created a full-featured user management table with search functionality, role badges, and status indicators. The layout includes an 'Add User' button and export option. The table is responsive and includes pagination controls for better data navigation.";
      } else if (originalIntent.includes('modal')) {
        return isModification 
          ? "I added a settings modal to your existing UI. The modal includes toggle switches for various preferences and maintains the same design language. I preserved all your existing components while adding this new functionality."
          : "I created a settings panel with a modal dialog. The main card displays current settings, and the modal provides a focused interface for making changes. I used toggle switches for boolean settings for better UX.";
      } else {
        return isModification
          ? `I modified your UI based on: "${originalIntent}". I kept your existing layout and components while adding the requested changes. The new elements match your current design pattern.`
          : `I created a ${originalIntent.includes('form') ? 'form' : 'UI component'} based on your request. I used Card components for structure, proper spacing, and a clean, professional design that's both functional and visually appealing.`;
      }
    }

    try {
      const prompt = `Explain this UI generation decision:
    
Original intent: "${originalIntent}"
Plan: ${JSON.stringify(plan, null, 2)}
${isModification ? 'This is a modification of existing UI.' : 'This is a new UI generation.'}

Provide a clear, concise explanation (2-3 sentences) covering:
1. Layout choice
2. Component selection
3. How it addresses the request`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You explain UI decisions clearly and concisely in 2-3 sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 150
      });

      return response.choices[0].message.content || 'Generated UI based on your request.';
    } catch (error) {
      console.error('Explanation failed:', error);
      return 'Generated UI based on your request.';
    }
  }
}