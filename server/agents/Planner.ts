import OpenAI from 'openai';

export interface LayoutPlan {
  structure: 'single-column' | 'two-column' | 'dashboard' | 'modal-overlay';
  components: Array<{
    type: string;
    props: Record<string, any>;
    position?: string;
    children?: any[];
  }>;
  theme: {
    spacing: 'compact' | 'comfortable' | 'spacious';
    variant: 'default' | 'minimal' | 'bordered';
  };
}

const ALLOWED_COMPONENTS = [
  'Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'
];

const PLANNER_PROMPT = `You are a UI Planner. Your ONLY job is to output a structured JSON plan.
Available components: ${ALLOWED_COMPONENTS.join(', ')}
Layout types: single-column, two-column, dashboard, modal-overlay
Theme variants: default, minimal, bordered
Spacing: compact, comfortable, spacious

User intent: {{intent}}
Existing code: {{existingCode}}
Is modification: {{isModification}}

Output ONLY valid JSON with this structure:
{
  "structure": "layout type",
  "components": [
    {
      "type": "ComponentName",
      "props": { ... },
      "position": "optional position hint",
      "children": []
    }
  ],
  "theme": {
    "spacing": "spacing value",
    "variant": "variant value"
  }
}`;

export class Planner {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
    });
  }

  async plan(intent: string, existingCode?: string): Promise<LayoutPlan> {
    // If no API key, return mock plan
    if (!process.env.OPENAI_API_KEY) {
      return this.getMockPlan(intent);
    }

    const isModification = !!existingCode;
    const prompt = PLANNER_PROMPT
      .replace('{{intent}}', intent)
      .replace('{{existingCode}}', existingCode || 'none')
      .replace('{{isModification}}', isModification.toString());

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a precise UI planner. Output only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const plan = JSON.parse(response.choices[0].message.content || '{}');
      this.validatePlan(plan);
      return plan;
    } catch (error) {
      console.error('Planning failed:', error);
      return this.getMockPlan(intent);
    }
  }

  private validatePlan(plan: any) {
    if (!plan.structure || !plan.components || !plan.theme) {
      throw new Error('Invalid plan structure');
    }
  }

  private getMockPlan(intent: string): LayoutPlan {
    if (intent.includes('dashboard')) {
      return {
        structure: 'dashboard',
        components: [
          { type: 'Navbar', props: { title: 'Dashboard' } },
          { type: 'Sidebar', props: {} },
          { type: 'Card', props: { title: 'Revenue' } },
          { type: 'Card', props: { title: 'Users' } },
          { type: 'Chart', props: { type: 'line' } },
          { type: 'Table', props: {} }
        ],
        theme: {
          spacing: 'comfortable',
          variant: 'default'
        }
      };
    } else if (intent.includes('login')) {
      return {
        structure: 'single-column',
        components: [
          { type: 'Card', props: { title: 'Welcome Back' } },
          { type: 'Input', props: { type: 'email', label: 'Email' } },
          { type: 'Input', props: { type: 'password', label: 'Password' } },
          { type: 'Button', props: { variant: 'primary', children: 'Sign In' } }
        ],
        theme: {
          spacing: 'comfortable',
          variant: 'default'
        }
      };
    } else {
      return {
        structure: 'single-column',
        components: [
          { type: 'Card', props: { title: 'Generated UI' } }
        ],
        theme: {
          spacing: 'comfortable',
          variant: 'default'
        }
      };
    }
  }
}