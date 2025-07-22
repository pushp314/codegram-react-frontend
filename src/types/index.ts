// This file defines the TypeScript shapes for our main data models.
// Using these types across the app prevents bugs and improves autocompletion.

export interface User {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio?: string;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  content: string;
  author: User;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Doc {
    id: string;
    title: string;
    content: string;
    author: User;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
}

export interface Bug {
    id: string;
    title: string;
    description: string;
    author: User;
    createdAt: string;
    expiresAt: string;
    media?: string[];
}

export interface Comment {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    replies?: Comment[];
}

export interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'REPLY';
    sender: User;
    snippet?: { id: string; title: string };
    doc?: { id: string; title: string };
    comment?: { id: string; content: string };
    createdAt: string;
}
