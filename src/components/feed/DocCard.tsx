// =============== src/components/feed/DocCard.tsx ===============
import React from 'react';
import type { Doc as DocType } from '../../types';
import { Card as CardDoc, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface DocCardProps {
  doc: DocType;
}

export const DocCard: React.FC<DocCardProps> = ({ doc }) => {
  // A simple markdown preview could be added here later
  return (
    <CardDoc>
      <CardHeader>
        <CardTitle>{doc.title}</CardTitle>
        <CardDescription>{doc.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-h-48 overflow-hidden">
            <p>{doc.content.substring(0, 200)}...</p>
        </div>
      </CardContent>
    </CardDoc>
  );
};
