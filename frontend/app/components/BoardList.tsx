'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { createBoard, deleteBoard, getBoards, updateBoard } from '../lib/api';
import { Board } from '../types';
import Link from 'next/link';
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import DropdownMenu from "./ui/DropdownMenu";
import Modal from "./ui/Modal";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getBoards().then(res => {
        setBoards(res.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      }).catch(console.error);
    }
  }, [user]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const newBoard = await createBoard({ title });
      setBoards([...boards, newBoard]);
      setTitle('');
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleEditBoard = async () => {
    if (!editTitle || selectedBoardId === null) return;
    try {
      const updatedBoard = await updateBoard(selectedBoardId, { title: editTitle });
      setBoards(boards.map((board) => (board.id === selectedBoardId ? updatedBoard : board)));
      setEditingBoardId(null);
      setEditTitle('');
      setShowEditModal(false);
      setSelectedBoardId(null);
    } catch (err) {
      console.error('Failed to update board:', err);
    }
  };

  const handleDeleteBoard = async () => {
    if (selectedBoardId === null) return;
    try {
      await deleteBoard(selectedBoardId);
      setBoards(boards.filter((board) => board.id !== selectedBoardId));
      setShowDeleteModal(false);
      setSelectedBoardId(null);
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const fromIdx = result.source.index;
    const toIdx = result.destination.index;
    if (fromIdx === toIdx) return;

    const reordered = Array.from(boards);
    const [dragged] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, dragged);

    const boardsWithOrder = reordered.map((board, idx) => ({
      ...board,
      order: idx
    }));

    setBoards(boardsWithOrder);

    try {
      for (const b of boardsWithOrder) {
        await updateBoard(b.id, { order: b.order });
      }
    } catch (err) {
      console.error("Failed to save board order:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 bg-white rounded-md shadow mt-6 min-h-[850px]  ">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Your Boards</h1>
      {user ? (
        <>
      {boards.length < 9 && (
        <form onSubmit={handleCreateBoard} className="mb-6 flex gap-2 flex-wrap">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New board title"
            className="flex-1 text-xs sm:text-base"
          />
          <Button>Create Board</Button>
        </form>
      )}
          {boards.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="boards-droppable">
                {(provided, snapshot) => (
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[240px] " +
                      (snapshot.isDraggingOver ? " bg-blue-100" : "")
                    }
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {boards.map((board, idx) => (
                      <Draggable key={board.id} draggableId={String(board.id)} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={
                              "bg-gray-100 rounded-md shadow transition relative text-xs sm:text-base flex flex-col p-2 sm:p-4 min-h-[180px] " +
                              (snapshot.isDragging ? "bg-blue-50 border-2 border-blue-400 z-10" : "hover:bg-gray-200")
                            }
                            style={{
                              ...provided.draggableProps.style,
                              userSelect: "none"
                            }}
                          >
                            <div className="absolute top-2 right-2">
                              <DropdownMenu
                                onEdit={() => {
                                  setSelectedBoardId(board.id);
                                  setEditTitle(board.title);
                                  setShowEditModal(true);
                                }}
                                onDelete={() => {
                                  setSelectedBoardId(board.id);
                                  setShowDeleteModal(true);
                                }}
                              />
                            </div>
                            <Link href={`/boards/${board.id}`} className="block">
                              <h2 className="text-base sm:text-xl font-semibold text-gray-800">{board.title}</h2>
                              <p className="text-xs sm:text-sm text-gray-600">
                                Created: {new Date(board.createdAt).toLocaleDateString()}
                              </p>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <p className="text-gray-600">No boards yet. Create one to get started!</p>
          )}

          <Modal open={showEditModal} title="Edit Board" onClose={() => setShowEditModal(false)}>
            <form onSubmit={(e) => { e.preventDefault(); void handleEditBoard(); }} className="space-y-2">
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit board title"
              />
              <div className="flex gap-2">
                <button type="submit" className="text-white bg-blue-400 px-4 py-1 rounded">Save</button>
                <button type="button" className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </Modal>

          <Modal open={showDeleteModal} title="Delete Board?" onClose={() => setShowDeleteModal(false)}>
            <p className="mb-4">Are you sure you want to delete this board?</p>
            <div className="flex gap-2">
              <button className="text-white px-4 py-1 rounded bg-red-500 hover:bg-red-600" onClick={handleDeleteBoard}>
                Delete
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded  text-black" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </Modal>
        </>
      ) : (
        <p className="text-gray-600">
          Please <Link href="/login" className="text-blue-400 hover:underline">login</Link> to view your boards.
        </p>
      )}
    </div>
  );
}