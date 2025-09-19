'use client';

import {Draggable} from '@hello-pangea/dnd';
import {deleteCard, updateCard} from '../lib/api';
import {Card} from '../types';
import {FormEvent, useState} from 'react';

export default function CardComponent({
                                        card,
                                        index,
                                        boardId,
                                        columnId,
                                        onDelete,
                                        onUpdate,
                                      }: {
  card: Card;
  index: number;
  boardId: number;
  columnId: number;
  onDelete?: (cardId: number) => void;
  onUpdate?: (updatedCard: Card) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // use current card.columnId (more reliable)
      const updated = await updateCard(boardId, card.columnId, card.id, { title, description });
      onUpdate?.(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update card:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this card?')) return;
    setIsDeleting(true);
    try {
      await deleteCard(boardId, card.columnId, card.id);
      onDelete?.(card.id);
      // do NOT call onUpdate with the same object (was causing confusion)
    } catch (err) {
      console.error('Failed to delete card:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-2 rounded-md shadow-sm"
        >
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-1"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-1"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white p-1 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h4 className="font-semibold">{card.title}</h4>
              {card.description && <p className="text-sm text-gray-600">{card.description}</p>}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-300 text-black p-0.5 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-gray-300 text-black p-0.5 rounded-md hover:bg-red-600"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}