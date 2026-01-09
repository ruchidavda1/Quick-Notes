import { Note, AuthToken } from './types';

// In-memory storage
class Storage {
  private notes: Map<string, Note> = new Map();
  private tokens: Map<string, string> = new Map(); // token -> userId

  // Notes operations
  saveNote(note: Note): void {
    this.notes.set(note.id, note);
  }

  getNote(id: string): Note | undefined {
    return this.notes.get(id);
  }

  getNotesByUser(userId: string): Note[] {
    const userNotes: Note[] = [];
    this.notes.forEach((note) => {
      if (note.userId === userId) {
        userNotes.push(note);
      }
    });
    // Sort by createdAt descending (newest first)
    return userNotes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  deleteNote(id: string): boolean {
    return this.notes.delete(id);
  }

  // Auth operations
  saveToken(token: string, userId: string): void {
    this.tokens.set(token, userId);
  }

  getUserIdByToken(token: string): string | undefined {
    return this.tokens.get(token);
  }
}

export const storage = new Storage();

