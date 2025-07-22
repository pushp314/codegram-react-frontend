// =============== src/types/index.ts ===============
// This file defines the TypeScript shapes for our main data models.
// Using these types across the app prevents bugs and improves autocompletion.

export interface User {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN'; // Added user role
  bio?: string;
  techStack?: string[];
  location?: string;
  website?: string;
  githubUrl?: string;
  _count?: {
    followers: number;
    following: number;
    snippets: number;
  }
}

export interface ContentBase {
    id: string;
    title: string;
    author: User;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
    isBookmarked: boolean;
    likesCount: number;
    commentsCount: number;
    bookmarksCount: number;
    tags: string[];
    type: 'snippet' | 'doc' | 'bug';
}

export interface Snippet extends ContentBase {
  type: 'snippet';
  description: string | null;
  content: string;
  language: string;
}

export interface Doc extends ContentBase {
  type: 'doc';
  description: string | null;
  content: string;
  coverImage: string | null;
}

export interface Bug extends ContentBase {
  type: 'bug';
  description: string;
  content: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  media: string[];
  expiresAt: string;
}

// This is the shape of the data coming from the /api/feed endpoint
export type FeedItemDTO = Snippet | Doc | Bug;


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
    read: boolean;
    snippet?: { id: string; title: string };
    doc?: { id: string; title: string };
    comment?: { id: string; content: string };
    createdAt: string;
}
export interface UserProfile {
    user: User;
    followers: User[];
    following: User[];
    snippets: Snippet[];
    docs: Doc[];
    bugs: Bug[];
}