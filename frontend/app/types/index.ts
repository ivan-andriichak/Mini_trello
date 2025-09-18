export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
}

export interface TokenPair {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

export interface Board {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Column {
  id: number;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  boardId: number;
  cards: Card[];
}

export interface Card {
  id: number;
  title: string;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  columnId: number;
}