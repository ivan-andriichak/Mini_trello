'use client';

import {Draggable} from '@hello-pangea/dnd';
import {deleteCard, updateCard} from '../lib/api';
import {Card} from '../types';
import {FormEvent, useState} from 'react';
import Modal from "./Modal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
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
    setIsDeleting(true);
    try {
      await deleteCard(boardId, card.columnId, card.id);
      onDelete?.(card.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete card:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Draggable draggableId={String(card.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={
              "bg-white p-3 rounded-lg shadow transition-transform duration-150 select-none " +
              (snapshot.isDragging
                ? "outline outline-4 outline-blue-400 scale-105 z-30"
                : "hover:shadow-lg hover:scale-[1.02]")
            }
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
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                  {card.title}
                </h4>
                {card.description && <p className="text-sm text-gray-600 mt-1">{card.description}</p>}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded hover:bg-yellow-500 hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                    className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Draggable>

      <Modal open={showDeleteModal} title="Delete Card?" onClose={() => setShowDeleteModal(false)}>
        <p className="mb-4">Are you sure you want to delete this card?</p>
        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-400"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}