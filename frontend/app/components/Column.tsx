'use client';

import {FormEvent, useState} from 'react';
import {Droppable} from '@hello-pangea/dnd';
import {Column as ColumnType} from '../types';
import {createCard, deleteColumn, updateColumn} from '../lib/api';
import CardComponent from './Card';
import Modal from "./Modal";

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
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardOrder, setNewCardOrder] = useState(0);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditColumn = async () => {
    try {
      const updated = await updateColumn(boardId, column.id, { title: editTitle });
      setEditTitle(updated.title);
      setIsEditModalOpen(false);
      onRefresh?.();
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
        order: newCardOrder,
      });
      onRefresh?.();
      setNewCardTitle('');
      setNewCardDescription('');
      setNewCardOrder(0);
    } catch (err) {
      console.error('Failed to create card:', err);
    } finally {
      setIsCreatingCard(false);
    }
  };

  return (
    <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-md flex flex-col min-w-[270px] max-w-xs flex-shrink-0">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{editTitle}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-yellow-700 hover:text-yellow-900 transition"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-700 transition"
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
              "space-y-2 mb-2 overflow-y-auto overflow-x-hidden max-h-[550px] transition-all scrollbar-thin scrollbar-thumb-gray-300 "  +
              (snapshot.isDraggingOver ? "bg-blue-100" : "")
            }
          >
            {(column.cards || []).filter(Boolean).length === 0 && (
              <div className="text-center text-gray-400 py-8 italic opacity-70">
                No cards yet
              </div>
            )}
            {(column.cards || [])
              .filter(Boolean)
              .map((card, index) => (
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
            {provided.placeholder}
          </div>
        )}
      </Droppable>
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
            className="bg-green-500 text-white p-0.5 rounded-md hover:bg-green-600"
          >
            {isCreatingCard ? 'Creating...' : 'Add Card'}
          </button>
        </div>
      </form>
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
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-400"
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
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
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
        </Modal>
      )}
    </div>
  );
}