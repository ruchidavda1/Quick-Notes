export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNoteDto {
  title: string;
  body?: string;
}

export interface UpdateNoteDto {
  title?: string;
  body?: string;
}

export interface AuthToken {
  token: string;
  userId: string;
}

export interface ApiError {
  error: string;
}

