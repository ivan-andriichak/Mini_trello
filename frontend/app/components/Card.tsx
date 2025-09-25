'use client';

import {Draggable} from '@hello-pangea/dnd';
import {deleteCard, updateCard} from '../lib/api';
import {Card} from '../types';
import {FormEvent, useState} from 'react';
import Modal from "./ui/Modal";
import {Input} from "./ui/Input";
import DropdownMenu from "./ui/DropdownMenu";

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
 const getColumnColorClass = (index: number) => {
   switch (index) {
     case 0:
       return 'bg-blue-400';
     case 1:
       return 'bg-green-400';
     case 2:
       return 'bg-orange-400';
     default:
       return 'bg-gray-400';
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
              "bg-white p-2 sm:p-3 rounded-lg shadow transition-transform duration-150 select-none border border-gray-300 text-xs sm:text-base " +
              (snapshot.isDragging ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50')
            }
          >
            {isEditing ? (
              <Modal open={isEditing} title="Edit Card" onClose={() => setIsEditing(false)}>
                <form onSubmit={handleUpdate} className="space-y-2">
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-1 text-xs sm:text-base"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-blue-400 text-white p-1 rounded-md text-xs sm:text-base"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 p-1 rounded-md hover:bg-gray-300 text-xs sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-xs sm:text-base">
                     <span
                       className={`inline-block w-2 h-2 rounded-full ${getColumnColorClass(index)}`}
                     />
                      {card.title}
                    </h4>
                    {card.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{card.description}</p>
                    )}
                  </div>
                  <DropdownMenu
                    onEdit={() => setIsEditing(true)}
                    onDelete={() => setShowDeleteModal(true)}
                  />
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
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}