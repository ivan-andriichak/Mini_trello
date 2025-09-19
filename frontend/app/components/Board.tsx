'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { createColumn, getColumns, updateCard, deleteColumn } from '../lib/api';
import { Column } from '../types';
import ColumnComponent from './Column';

export default function Board({ boardId }: { boardId: number }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnOrder, setNewColumnOrder] = useState(0);

  useEffect(() => {
    getColumns(boardId)
      .then((data) => {
        const normalizedColumns = data.map((col) => ({
          ...col,
          cards: col.cards || [],
        }));
        setColumns(normalizedColumns);
      })
      .catch((err) => console.error('Error fetching columns:', err));
  }, [boardId]);

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle) return;
    try {
      const newColumn = await createColumn(boardId, { title: newColumnTitle, order: newColumnOrder });
      setColumns([...columns, { ...newColumn, cards: newColumn.cards || [] }]);
      setNewColumnTitle('');
      setNewColumnOrder(0);
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    try {
      await deleteColumn(boardId, columnId);
      setColumns(columns.filter((col) => col.id !== columnId));
    } catch (err) {
      console.error('Failed to delete column:', err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceColumn = columns.find((col) => col.id === +source.droppableId);
    const destColumn = columns.find((col) => col.id === +destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(sourceColumn.cards || []);
      // guard: ensure source.index valid
      if (source.index < 0 || source.index >= newCards.length) return;

      const [reorderedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, reorderedCard);

      const updatedCards = newCards.map((card, index) => ({ ...card, order: index }));
      setColumns(
        columns.map((col) =>
          col.id === sourceColumn.id ? { ...col, cards: updatedCards } : col
        )
      );

      try {
        await updateCard(boardId, sourceColumn.id, +draggableId, { order: destination.index });
      } catch (err) {
        console.error('Failed to update card order:', err);
      }
    } else {
      const sourceCards = Array.from(sourceColumn.cards || []);
      const destCards = Array.from(destColumn.cards || []);
      // guard: ensure source.index valid
      if (source.index < 0 || source.index >= sourceCards.length) return;

      const [movedCard] = sourceCards.splice(source.index, 1);
      if (!movedCard) return; // safety

      // update moved card locally
      const movedCardUpdated = { ...movedCard, columnId: destColumn.id, order: destination.index };

      // insert into destCards at destination.index
      destCards.splice(destination.index, 0, movedCardUpdated);

      const updatedSourceCards = sourceCards.map((card, index) => ({ ...card, order: index }));
      const updatedDestCards = destCards.map((card, index) => ({ ...card, order: index }));

      setColumns(
        columns.map((col) =>
          col.id === sourceColumn.id
            ? { ...col, cards: updatedSourceCards }
            : col.id === destColumn.id
              ? { ...col, cards: updatedDestCards }
              : col
        )
      );

      try {
        // include new columnId so backend can move the card
        await updateCard(boardId, sourceColumn.id, +draggableId, { order: destination.index, columnId: destColumn.id });
      } catch (err) {
        console.error('Failed to move card:', err);
        // On failure, refetch columns to restore consistent state
        getColumns(boardId)
          .then((data) => {
            const normalizedColumns = data.map((col) => ({ ...col, cards: col.cards || [] }));
            setColumns(normalizedColumns);
          })
          .catch((e) => console.error('Failed to refetch columns after failed move:', e));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Board</h2>
      <form onSubmit={handleCreateColumn} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
        <input
          type="number"
          value={newColumnOrder}
          onChange={(e) => setNewColumnOrder(+e.target.value)}
          placeholder="Order"
          className="w-20 border border-gray-300 rounded-md p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Create Column
        </button>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((column) => (
            <ColumnComponent
              key={column.id}
             column={column}
              boardId={boardId}
              onDelete={handleDeleteColumn}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}