import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { prompt, messages, currentCode } = await request.json();

    // Construct the system message with Mermaid context
    const systemMessage = `You are ZOBA's diagram assistant, specialized in Mermaid.js diagrams. You ONLY help with creating and modifying diagrams.

Current diagram code:
\`\`\`mermaid
${currentCode}
\`\`\`

IMPORTANT RULES:
1. ONLY respond to requests about creating, modifying, or explaining Mermaid diagrams
2. For any other requests (like general questions, coding help, or non-diagram tasks), respond with:
   "I'm your diagram assistant. I can only help with creating and modifying diagrams. Please let me know if you'd like help with your diagram!"
3. Never generate non-diagram code or content

DIAGRAM-SPECIFIC SYNTAX:
1. Flowchart styling:
   - Node colors: style NodeName fill:#ff0000
   - Edge colors: linkStyle 0 stroke:#ff0000,stroke-width:2px

2. XY Chart styling (beta):
   - Use theme configuration at the start of the diagram:
     ---
     config:
       themeVariables:
         xyChart:
           plotColorPalette: "#hexcolor"    # For all plots
           backgroundColor: "#hexcolor"      # Background color
           gridColor: "#hexcolor"           # Grid line color
     ---
   - Example with green bars and lines:
     ---
     config:
       themeVariables:
         xyChart:
           plotColorPalette: "#00ff00"
     ---
     xychart-beta
       title "Chart Title"
       x-axis [labels]
       y-axis "Label" min --> max
       line [values]
       bar [values]

3. Sequence diagram styling:
   - Actor colors: participant Alice #ff0000
   - Note colors: Note over Alice #ff0000

When handling diagram requests:
1. Analyze the current diagram code and its type
2. Use the correct styling syntax for that specific diagram type
3. Return the complete modified diagram code
4. Explain what changes were made

Always return valid Mermaid.js syntax for the specific diagram type.`;

    // Convert previous messages to Claude format
    const previousMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content
    }));

    // Make the API call to Claude
    const completion = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      temperature: 0.5,
      system: systemMessage,
      messages: [
        ...previousMessages,
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the response and any code blocks
    const response = completion.content[0].type === 'text' ? completion.content[0].text : '';
    let code = currentCode;

    // Look for Mermaid code blocks in the response
    const mermaidCodeMatch = response.match(/\`\`\`(?:mermaid)?\n([\s\S]*?)\n\`\`\`/);
    if (mermaidCodeMatch) {
      code = mermaidCodeMatch[1].trim();
    }

    return NextResponse.json({
      response,
      code
    });

  } catch (error) {
    console.error('Error generating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to generate diagram' },
      { status: 500 }
    );
  }
} 