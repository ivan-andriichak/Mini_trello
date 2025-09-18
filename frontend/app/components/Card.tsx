'use client';

import { Draggable }  from '@hello-pangea/dnd';
import { updateCard, deleteCard } from '../lib/api';
import { Card } from '../types';
import { useState } from 'react';

export default function CardComponent({ card, index, boardId, columnId }: { card: Card; index: number; boardId: number; columnId: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCard(boardId, columnId, card.id, { title, description });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update card:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCard(boardId, columnId, card.id);
      window.location.reload(); // Refresh to update cards
    } catch (err) {
      console.error('Failed to delete card:', err);
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
                <button type="submit" className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600">
                  Save
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
                  className="bg-yellow-500 text-white p-1 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}