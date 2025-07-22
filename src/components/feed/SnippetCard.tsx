// =============== src/components/feed/SnippetCard.tsx ===============
import React from 'react';
import Editor from '@monaco-editor/react';
import type { Snippet as SnippetType } from '../../types';
import { Card as CardSnippet, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface SnippetCardProps {
  snippet: SnippetType;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  return (
    <CardSnippet>
      <CardHeader>
        <CardTitle>{snippet.title}</CardTitle>
        <CardDescription>{snippet.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
           <Editor
              height="200px"
              language={snippet.language.toLowerCase()}
              value={snippet.content}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
        </div>
      </CardContent>
    </CardSnippet>
  );
};
