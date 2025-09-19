'use client';

import React, {useEffect, useState} from 'react';
import {DragDropContext, DropResult} from '@hello-pangea/dnd';
import {createColumn, deleteColumn, getColumns, updateCard} from '../lib/api';
import {Column} from '../types';
import ColumnComponent from './Column';

export default function Board({ boardId }: { boardId: number }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnOrder, setNewColumnOrder] = useState(0);

  const fetchColumns = (async () => {
    try {
      const data = await getColumns(boardId);
      const normalizedColumns = data.map((col) => ({ ...col, cards: col.cards || [] }));
      setColumns(normalizedColumns);
    } catch (err) {
      console.error('Error fetching columns:', err);
    }
  });

  useEffect(() => {
   void fetchColumns();
  }, [boardId, fetchColumns]);

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle) return;
    try {
      const newColumn = await createColumn(boardId, { title: newColumnTitle, order: newColumnOrder });
      setColumns((prev) => [...prev, { ...newColumn, cards: newColumn.cards || [] }]);
      setNewColumnTitle('');
      setNewColumnOrder(0);
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    try {
      await deleteColumn(boardId, columnId);
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    } catch (err) {
      console.error('Failed to delete column:', err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Find source/dest columns using current state snapshot
    const sourceColumn = columns.find((col) => col.id === +source.droppableId);
    const destColumn = columns.find((col) => col.id === +destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    const cardId = +draggableId;

    // Determine source column id BEFORE optimistic update — use this in URL for PATCH
    const sourceColumnIdForApi = sourceColumn.id;

    // Robust: find actual index of the card by id in source column (in case indices changed)
    const realSourceIndex = sourceColumn.cards.findIndex((c) => c?.id === cardId);
    if (realSourceIndex === -1) {
      // Card not found in source (maybe deleted) — refresh to recover
      await fetchColumns();
      return;
    }

    // Optimistic update: update local columns state by moving the card
    setColumns((prevCols) => {
      const nextCols = prevCols.map((c) => ({ ...c, cards: Array.from(c.cards || []) }));
      const src = nextCols.find((c) => c.id === sourceColumn.id)!;
      const dst = nextCols.find((c) => c.id === destColumn.id)!;

      // Use card id to extract moved card
      const idxInSrc = src.cards.findIndex((c) => c?.id === cardId);
      if (idxInSrc === -1) return prevCols; // nothing to do

      const [moved] = src.cards.splice(idxInSrc, 1);
      if (!moved) return prevCols;

      // Insert at destination index (clamp)
      const insertIndex = Math.max(0, Math.min(destination.index, dst.cards.length));
      const movedUpdated = { ...moved, columnId: dst.id, order: insertIndex };
      dst.cards.splice(insertIndex, 0, movedUpdated);

      // Reindex orders locally for all columns
      return nextCols.map((c) => ({ ...c, cards: c.cards.map((card, idx) => ({ ...card, order: idx })) }));
    });

    // Prepare payload: include columnId only when moving between columns
    const body: { order?: number; columnId?: number } = { order: destination.index };
    if (source.droppableId !== destination.droppableId) {
      body.columnId = +destination.droppableId;
    }

    // Perform API request using sourceColumnIdForApi in URL (where card was before move)
    try {
      await updateCard(boardId, sourceColumnIdForApi, cardId, body);
    } catch (err) {
      console.error('Failed to move/update card on server:', err);
      // sync with server authoritative state
      void fetchColumns();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Board</h2>
      <form onSubmit={handleCreateColumn} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
          className="flex-1 border border-gray-300 rounded-md p-2"
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