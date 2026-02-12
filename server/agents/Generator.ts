import OpenAI from 'openai';
import { LayoutPlan } from './Planner';

const GENERATOR_PROMPT = `You are a UI Generator. Convert this plan into React code using ONLY these components:
- Button
- Card
- Input
- Table
- Modal
- Sidebar
- Navbar
- Chart

Plan: {{plan}}

Requirements:
1. Use Tailwind CSS classes only - NO inline styles
2. DO NOT create new components
3. Use functional components with hooks where needed
4. Include proper TypeScript types
5. Make it responsive

Output ONLY the React component code, no explanations.`;

export class Generator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
    });
  }

  async generate(plan: LayoutPlan): Promise<string> {
    // If no API key, return empty - we'll use mock responses from index.ts
    if (!process.env.OPENAI_API_KEY) {
      return '';
    }

    const prompt = GENERATOR_PROMPT.replace('{{plan}}', JSON.stringify(plan, null, 2));

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You generate precise React code using only whitelisted components.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2
      });

      let code = response.choices[0].message.content || '';
      code = this.extractComponentCode(code);
      this.validateComponents(code);
      
      return code;
    } catch (error) {
      console.error('Generation failed:', error);
      return '';
    }
  }

  private extractComponentCode(content: string): string {
    const match = content.match(/```(?:tsx|jsx)?\s*([\s\S]*?)```/) || 
                  content.match(/(export default function[\s\S]+?\})/) ||
                  [null, content];
    return match[1] || content;
  }

  private validateComponents(code: string) {
    const forbiddenPatterns = [
      /styled\./,
      /css`/,
      /style=\s*\{\s*\{/,
      /import\s+.*\s+from\s+['"]@mui/,
      /import\s+.*\s+from\s+['"]antd/,
      /import\s+.*\s+from\s+['"]@chakra/
    ];

    forbiddenPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        throw new Error(`Generated code contains forbidden pattern: ${pattern}`);
      }
    });
  }
}