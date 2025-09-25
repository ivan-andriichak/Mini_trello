'use client';

import {FormEvent, useState} from 'react';
import {Droppable} from '@hello-pangea/dnd';
import {Column as ColumnType} from '../types';
import {createCard, updateColumn} from '../lib/api';
import CardComponent from './Card';
import Modal from "./ui/Modal";
import {Input} from "./ui/Input";

export default function ColumnComponent({
                                          column,
                                          boardId,
                                          onDelete,
                                          onRefresh,
                                        }: {
  column: ColumnType;
  boardId: number;
  onDelete: (columnId: number) => void;
  onRefresh?: () => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [localTitle, setLocalTitle] = useState(column.title);

  const handleEditColumn = async () => {
    try {
      const updated = await updateColumn(boardId, column.id, { title: editTitle });
      setLocalTitle(updated.title);
      setEditTitle(updated.title);
      setIsEditModalOpen(false);

    } catch (err) {
      console.error('Failed to update column:', err);
    }
  };

  const handleDeleteColumn = async () => {
    setIsDeleting(true);
    try {
      onDelete(column.id);
      setShowDeleteModal(false);
      onRefresh?.();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCard = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!newCardTitle) return;

    setIsCreatingCard(true);
    try {
      await createCard(boardId, column.id, {
        title: newCardTitle,
        description: newCardDescription,
        order: (column.cards?.length || 0) + 1,
      });
      onRefresh?.();
      setNewCardTitle('');
      setNewCardDescription('');
      setIsAddingCard(false);
    } catch (err) {
      console.error('Failed to create card:', err);
    } finally {
      setIsCreatingCard(false);
    }
  };

  return (
  <div className="bg-white p-2 sm:p-4 rounded-xl border border-gray-200 shadow-md flex flex-col min-w-[220px] max-w-full xs:min-w-[180px]
  xs:max-w-[220px]
  sm:min-w-[250px] sm:max-w-[250px]
  flex-shrink-0 w-[95vw] xs:w-[90vw] sm:w-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">{localTitle}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-grey-200 hover:text-yellow-900 transition text-xs sm:text-base"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-700 transition text-xs sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={
              "space-y-2 mb-2 overflow-y-auto overflow-x-hidden max-h-[360px] sm:max-h-[550px] transition-all scrollbar-thin scrollbar-thumb-gray-300 " +
              (snapshot.isDraggingOver ? "bg-blue-100" : "")
            }
          >
            {(column.cards || []).length === 0 && (
              <div className="text-center text-gray-400 py-8 italic opacity-70 text-xs sm:text-base">
                No cards yet
              </div>
            )}
            {(column.cards || []).map((card, index) => (
              <CardComponent
                key={card.id}
                card={card}
                index={index}
                boardId={boardId}
                columnId={column.id}
                onDelete={() => onRefresh?.()}
                onUpdate={() => onRefresh?.()}
              />
            ))}
            <br />
            <div className="mb-8">{provided.placeholder}</div>
          </div>
        )}
      </Droppable>

      {isAddingCard ? (
     <form onSubmit={handleCreateCard} className="space-y-2 mt-2 ">
          <Input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Card title"
            className="w-full border border-gray-300 rounded-md p-1 text-xs sm:text-base"
            required
            disabled={isCreatingCard}
          />
          <Input
            type="text"
            value={newCardDescription}
            onChange={(e) => setNewCardDescription(e.target.value)}
            placeholder="Card description (optional)"
            className="w-full border border-gray-300 rounded-md p-1 text-xs sm:text-base"
            disabled={isCreatingCard}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isCreatingCard}
              className="bg-blue-400 text-white p-0.5 rounded-md text-xs sm:text-base"
            >
              {isCreatingCard ? 'Creating...' : 'Add Card'}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 p-0.5 rounded-md hover:bg-gray-300 text-xs sm:text-base"
              onClick={() => setIsAddingCard(false)}
              disabled={isCreatingCard}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="bg-blue-100 text-white p-1 rounded-md hover:bg-blue-400 mt-2 w-full text-xs sm:text-base"
          onClick={() => setIsAddingCard(true)}
        >
          + Add Card
        </button>
      )}

      <Modal open={showDeleteModal} title="Delete Column?" onClose={() => setShowDeleteModal(false)}>
        <p className="mb-4">Are you sure you want to delete this column and all its cards?</p>
        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            onClick={handleDeleteColumn}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {isEditModalOpen && (
        <Modal open={isEditModalOpen} title="Edit Column" onClose={() => setIsEditModalOpen(false)}>
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
              className="bg-blue-400 text-white p-2 rounded-md"
              onClick={handleEditColumn}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-200  p-2 rounded-md hover:bg-gray-300"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}