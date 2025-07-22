// =============== src/components/feed/BugCard.tsx ===============
import React from 'react';
import type { Bug as BugType } from '../../types';
import { Card as CardBug, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface BugCardProps {
  bug: BugType;
}

export const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  return (
    <CardBug className="border-l-4 border-red-500">
      <CardHeader>
        <CardTitle>{bug.title}</CardTitle>
        <CardDescription>{bug.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Severity: {bug.severity}</span>
            <span>Status: {bug.status}</span>
        </div>
      </CardContent>
    </CardBug>
  );
};
