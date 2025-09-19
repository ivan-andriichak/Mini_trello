'use client';

import {FormEvent, useEffect, useState} from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Card as CardType } from '../types';
import { updateColumn, createCard } from '../lib/api';
import CardComponent from './Card';

export default function ColumnComponent({
                                          column,
                                          boardId,
                                          onDelete,
                                        }: {
  column: ColumnType;
  boardId: number;
  onDelete: (columnId: number) => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [cards, setCards] = useState<CardType[]>(column.cards || []);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardOrder, setNewCardOrder] = useState(0);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  useEffect(() => {
    setCards(column.cards || []);
  }, [column.cards]);

  const handleEditColumn = async () => {
    try {
      const updated = await updateColumn(boardId, column.id, { title: editTitle });
      setEditTitle(updated.title);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update column:', err);
    }
  };

  const handleDeleteColumn = () => {
    onDelete(column.id);
  };

  const handleCreateCard = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!newCardTitle) return;
    setIsCreatingCard(true);
    try {
      const created = await createCard(boardId, column.id, {
        title: newCardTitle,
        description: newCardDescription,
        order: newCardOrder,
      });
      setCards((prev) => [...prev, created]);
      setNewCardTitle('');
      setNewCardDescription('');
      setNewCardOrder(0);
    } catch (err) {
      console.error('Failed to create card:', err);
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handleCardDelete = (cardId: number) => {
    setCards((prev) => prev.filter((c) => c && c.id !== cardId));
  };

  const handleCardUpdate = (updatedCard: CardType) => {
    setCards((prev) => prev.map((c) => (c && c.id === updatedCard.id ? updatedCard : c)));
  };

  return (
    <div className="bg-transparent p-4 rounded-md w-64 border border-gray-300 shadow-md flex flex-col justify-between max-h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{editTitle}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-300 hover:text-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteColumn}
              className="text-gray-300 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
        <Droppable droppableId={String(column.id)}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[500px] space-y-2 mb-2"
            >
              {cards
                .filter(Boolean)
                .map((card, index) => (
                  <CardComponent
                    key={card!.id}
                    card={card!}
                    index={index}
                    boardId={boardId}
                    columnId={column.id}
                    onDelete={handleCardDelete}
                    onUpdate={handleCardUpdate}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <form onSubmit={handleCreateCard} className="space-y-2 mt-2">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Card title"
          className="w-full border border-gray-300 rounded-md p-1"
          required
        />
        <input
          type="text"
          value={newCardDescription}
          onChange={(e) => setNewCardDescription(e.target.value)}
          placeholder="Card description (optional)"
          className="w-full border border-gray-300 rounded-md p-1"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isCreatingCard}
            className="bg-gray-300 text-white p-0.5 rounded-md hover:bg-green-600"
          >
            {isCreatingCard ? 'Creating...' : 'Add Card'}
          </button>
        </div>
      </form>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-25">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Edit Column</h3>
            <div className="mb-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Column title"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-gray-300 text-white p-2 rounded-md hover:bg-green-600"
                onClick={handleEditColumn}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}