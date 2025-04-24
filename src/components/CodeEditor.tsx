"use client";

import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/components/theme-provider';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'markdown',
  height = '100%',
  className = '',
  readOnly = false,
}: CodeEditorProps) {
  const { theme: appTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Handle editor initialization
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Configure Mermaid syntax highlighting
    configureMermaidLanguage(monaco);
    
    // Focus the editor
    editor.focus();
  };
  
  // Configure Mermaid language for syntax highlighting
  const configureMermaidLanguage = (monaco: Monaco) => {
    // Register a new language
    monaco.languages.register({ id: 'mermaid' });
    
    // Define token providers for syntax highlighting
    monaco.languages.setMonarchTokensProvider('mermaid', {
      tokenizer: {
        root: [
          // Keywords
          [/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|journey|gitGraph)\b/, 'keyword'],
          
          // Directives
          [/%%.*$/, 'comment'],
          [/\b(title|accTitle|accDescr)\b/, 'keyword'],
          
          // Nodes and edges
          [/\b(subgraph|end)\b/, 'keyword'],
          [/\[|\]|\(|\)|\{|\}|>|</, 'delimiter'],
          [/--?>|--?-?|==?=?/, 'operator'],
          
          // Strings
          [/".*?"/, 'string'],
          [/'.*?'/, 'string'],
          
          // Class definitions
          [/\b(class|classDef)\b/, 'keyword'],
          
          // Comments
          [/%% .*$/, 'comment'],
          
          // Numbers
          [/\b\d+\b/, 'number'],
        ],
      },
    });
    
    // Define completion provider for autocompletion
    monaco.languages.registerCompletionItemProvider('mermaid', {
      provideCompletionItems: (model, position, context, token) => {
        // Get the word at the current position
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        // Create suggestions with proper range
        const suggestions = [
          {
            label: 'graph TD',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Result]\n    B -->|No| D[Alternative]',
            documentation: 'Create a top-down graph',
            range: range,
          },
          {
            label: 'graph LR',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'graph LR\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Result]\n    B -->|No| D[Alternative]',
            documentation: 'Create a left-to-right graph',
            range: range,
          },
          {
            label: 'sequenceDiagram',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'sequenceDiagram\n    participant A as Alice\n    participant B as Bob\n    A->>B: Hello Bob, how are you?\n    B->>A: I am good thanks!',
            documentation: 'Create a sequence diagram',
            range: range,
          },
          {
            label: 'classDiagram',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'classDiagram\n    class Animal {\n        +int age\n        +String gender\n        +isMammal()\n        +mate()\n    }\n    class Duck {\n        +String beakColor\n        +swim()\n        +quack()\n    }\n    Animal <|-- Duck',
            documentation: 'Create a class diagram',
            range: range,
          },
          {
            label: 'stateDiagram',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]',
            documentation: 'Create a state diagram',
            range: range,
          },
          {
            label: 'gantt',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'gantt\n    title A Gantt Diagram\n    dateFormat  YYYY-MM-DD\n    section Section\n    A task           :a1, 2023-01-01, 30d\n    Another task     :after a1, 20d\n    section Another\n    Task in sec      :2023-01-12, 12d\n    another task     :24d',
            documentation: 'Create a Gantt chart',
            range: range,
          },
          {
            label: 'pie',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'pie title Pets adopted by volunteers\n    "Dogs" : 386\n    "Cats" : 85\n    "Rats" : 15',
            documentation: 'Create a pie chart',
            range: range,
          },
        ];
        
        return {
          suggestions: suggestions,
        };
      },
    });
  };
  
  // Handle theme changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        theme: appTheme === 'dark' ? 'vs-dark' : 'vs-light',
      });
    }
  }, [appTheme]);
  
  // Additional editor features
  useEffect(() => {
    if (editorRef.current) {
      // Enable line numbers
      editorRef.current.updateOptions({
        lineNumbers: 'on',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingIndent: 'same',
        automaticLayout: true,
        tabSize: 2,
        readOnly: readOnly,
      });
    }
  }, [isEditorReady, readOnly]);
  
  // Custom actions
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };
  
  return (
    <div className={`code-editor-container ${className}`}>
      <Editor
        height={height}
        language="mermaid"
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme={appTheme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          lineNumbers: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'same',
          automaticLayout: true,
          tabSize: 2,
          readOnly: readOnly,
        }}
      />
    </div>
  );
}
