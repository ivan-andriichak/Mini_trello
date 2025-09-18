'use client';

import {useState} from 'react';
import {Droppable} from '@hello-pangea/dnd';
import {Column} from '../types';
import {updateColumn} from '../lib/api';
import CardComponent from './Card';

export default function ColumnComponent({ column, boardId, onDelete }: { column: Column; boardId: number; onDelete: (columnId: number) => void }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const handleEditColumn = async () => {
    try {
      await updateColumn(boardId, column.id, { title: editTitle });
      column.title = editTitle; // Update locally
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update column:', err);
    }
  };

  const handleDeleteColumn = () => {
    onDelete(column.id);
  };

  const cards = column.cards || [];

  return (
    <div className="bg-gray-100 p-4 rounded-md w-64 flex-shrink-0">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{column.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-yellow-500 hover:text-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteColumn}
            className="text-red-500 hover:text-red-600"
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
            className="min-h-[100px] space-y-2"
          >
            {cards.map((card, index) => (
              <CardComponent key={card.id} card={card} index={index} boardId={boardId} columnId={column.id} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

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
          </div>
        </div>
      )}
    </div>
  );
}