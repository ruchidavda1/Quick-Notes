import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { notesService } from '../services/notesService';
import { CreateNoteDto, UpdateNoteDto } from '../types';

const router = Router();

// POST /notes - Create a note
router.post('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const userId = req.userId!;
  const dto: CreateNoteDto = req.body;

  const result = notesService.createNote(userId, dto);

  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json(result.note);
});

// GET /notes - List all notes for the user
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const userId = req.userId!;
  const notes = notesService.getUserNotes(userId);
  res.status(200).json(notes);
});

// PATCH /notes/:id - Update a note
router.patch('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  const userId = req.userId!;
  const noteId = req.params.id;
  const dto: UpdateNoteDto = req.body;

  const result = notesService.updateNote(noteId, userId, dto);

  if (result.notFound) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  if (result.forbidden) {
    res.status(403).json({ error: 'You do not have permission to update this note' });
    return;
  }

  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(200).json(result.note);
});

// DELETE /notes/:id - Delete a note
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  const userId = req.userId!;
  const noteId = req.params.id;

  const result = notesService.deleteNote(noteId, userId);

  if (result.notFound) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  if (result.forbidden) {
    res.status(403).json({ error: 'You do not have permission to delete this note' });
    return;
  }

  res.status(204).send();
});

export default router;

