'use client';

import {FormEvent, useState} from 'react';
import {Droppable} from '@hello-pangea/dnd';
import {Column as ColumnType} from '../types';
import {createCard, updateColumn} from '../lib/api';
import CardComponent from './Card';
import Modal from "./ui/Modal";
import {Input} from "./ui/Input";
import DropdownMenu from "./ui/DropdownMenu";

const headerColorMap: { [key: number]: string } = {
  0: 'text-orange-300',
  1: 'text-green-500',
  2: 'text-blue-200',
};
const defaultHeaderColor = 'text-gray-700';

export default function ColumnComponent({
                                          column,
                                          boardId,
                                          onDelete,
                                          onRefresh,
                                          index,
                                        }: {
  column: ColumnType;
  boardId: number;
  onDelete: (columnId: number) => void;
  onRefresh?: () => void;
  index: number;
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
    <div className="w-[280px] rounded-xl bg-gray-100/80 shadow-md flex flex-col flex-shrink-0 ">
      <div className="p-3 flex justify-between items-center">
        <h3 className={`font-semibold text-sm sm:text-base ${headerColorMap[index % 3] || defaultHeaderColor}`}>{localTitle}</h3>
        <DropdownMenu
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() => setShowDeleteModal(true)}
        />
      </div>
      <div className="px-3 pb-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 ">
        <Droppable droppableId={String(column.id)}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 min-h-[40px] transition-colors duration-200 rounded-lg ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}
            >
              {(column.cards || []).length === 0 && !isAddingCard && (
                <div className="text-center text-gray-400 pt-8 pb-4 italic opacity-70 text-sm">
                  No cards yet
                </div>
              )}
              {(column.cards || []).map((card, cardIndex) => (
                <CardComponent
                  key={card.id}
                  card={card}
                  index={cardIndex}
                  columnIndex={index}
                  boardId={boardId}
                  onDelete={() => onRefresh?.()}
                  onUpdate={() => onRefresh?.()}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {isAddingCard ? (
          <form onSubmit={handleCreateCard} className="space-y-2 mt-2">
            <Input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Card title"
              className="p-2 text-xs sm:text-sm"
              required
              autoFocus
              disabled={isCreatingCard}
            />
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              placeholder="Card description (optional)"
              className="w-full border border-gray-300 rounded-md p-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              rows={3}
              disabled={isCreatingCard}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isCreatingCard}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {isCreatingCard ? 'Creating...' : 'Add Card'}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 text-xs sm:text-sm"
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
            className="text-gray-500 p-2 rounded-md hover:bg-gray-200 mt-2 w-full text-left text-xs sm:text-sm"
            onClick={() => setIsAddingCard(true)}
          >
            + Add a card
          </button>
        )}
      </div>

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

      <Modal open={isEditModalOpen} title="Edit Column" onClose={() => setIsEditModalOpen(false)}>
        <div className="mb-4">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full"
            placeholder="Column title"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md "
            onClick={handleEditColumn}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}