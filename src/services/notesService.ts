import { v4 as uuidv4 } from 'uuid';
import { Note, CreateNoteDto, UpdateNoteDto } from '../types';
import { storage } from '../storage';

export class NotesService {
  // Validation helper
  private validateTitle(title: string | undefined): string | null {
    if (!title) {
      return 'Title is required';
    }
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      return 'Title is required';
    }
    if (trimmed.length > 80) {
      return 'Title must not exceed 80 characters';
    }
    return null;
  }

  private validateBody(body: string | undefined): string | null {
    if (body !== undefined && body.length > 500) {
      return 'Body must not exceed 500 characters';
    }
    return null;
  }

  // Create a new note
  createNote(userId: string, dto: CreateNoteDto): { note?: Note; error?: string } {
    // Validate title
    const titleError = this.validateTitle(dto.title);
    if (titleError) {
      return { error: titleError };
    }

    // Validate body
    const bodyError = this.validateBody(dto.body);
    if (bodyError) {
      return { error: bodyError };
    }

    const note: Note = {
      id: `note_${uuidv4()}`,
      userId,
      title: dto.title.trim(),
      body: dto.body || '',
      createdAt: new Date().toISOString(),
    };

    storage.saveNote(note);
    return { note };
  }

  // Get all notes for a user
  getUserNotes(userId: string): Note[] {
    return storage.getNotesByUser(userId);
  }

  // Get a specific note
  getNote(noteId: string): Note | undefined {
    return storage.getNote(noteId);
  }

  // Update a note
  updateNote(
    noteId: string,
    userId: string,
    dto: UpdateNoteDto
  ): { note?: Note; error?: string; notFound?: boolean; forbidden?: boolean } {
    const note = storage.getNote(noteId);

    if (!note) {
      return { notFound: true };
    }

    if (note.userId !== userId) {
      return { forbidden: true };
    }

    // Check if there are any updatable fields
    if (dto.title === undefined && dto.body === undefined) {
      return { error: 'No updatable fields provided' };
    }

    // Validate title if provided
    if (dto.title !== undefined) {
      const titleError = this.validateTitle(dto.title);
      if (titleError) {
        return { error: titleError };
      }
    }

    // Validate body if provided
    if (dto.body !== undefined) {
      const bodyError = this.validateBody(dto.body);
      if (bodyError) {
        return { error: bodyError };
      }
    }

    // Update the note
    const updatedNote: Note = {
      ...note,
      title: dto.title !== undefined ? dto.title.trim() : note.title,
      body: dto.body !== undefined ? dto.body : note.body,
      updatedAt: new Date().toISOString(),
    };

    storage.saveNote(updatedNote);
    return { note: updatedNote };
  }

  // Delete a note
  deleteNote(
    noteId: string,
    userId: string
  ): { success?: boolean; notFound?: boolean; forbidden?: boolean } {
    const note = storage.getNote(noteId);

    if (!note) {
      return { notFound: true };
    }

    if (note.userId !== userId) {
      return { forbidden: true };
    }

    storage.deleteNote(noteId);
    return { success: true };
  }
}

export const notesService = new NotesService();

