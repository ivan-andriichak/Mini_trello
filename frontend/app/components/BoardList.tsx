'use client';

import React, {useEffect, useState} from 'react';
import {useAuth} from './AuthContext';
import {createBoard, deleteBoard, getBoards, updateBoard} from '../lib/api';
import {Board} from '../types';

import Link from 'next/link';
import {Button} from "./ui/Button";
import {Input} from "./ui/Input";

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getBoards().then(setBoards).catch(console.error);
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

  const handleEditBoard = async (boardId: number) => {
    if (!editTitle) return;
    try {
      const updatedBoard = await updateBoard(boardId, { title: editTitle });
      setBoards(boards.map((board) => (board.id === boardId ? updatedBoard : board)));
      setEditingBoardId(null);
      setEditTitle('');
    } catch (err) {
      console.error('Failed to update board:', err);
    }
  };

  const handleDeleteBoard = async (boardId: number) => {
    try {
      await deleteBoard(boardId);
      setBoards(boards.filter((board) => board.id !== boardId));
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const startEditing = (board: Board) => {
    setEditingBoardId(board.id);
    setEditTitle(board.title);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Boards</h1>
      {user ? (
        <>
          <form onSubmit={handleCreateBoard} className="mb-6 flex gap-2">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New board title"
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <Button>Create Board</Button>

          </form>
          {boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {boards.map((board) => (
                <div key={board.id} className="p-4 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition">
                  {editingBoardId === board.id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Edit board title"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBoard(board.id)}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBoardId(null)}
                          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Link href={`/boards/${board.id}`} className="block">
                        <h2 className="text-xl font-semibold text-gray-800">{board.title}</h2>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(board.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => startEditing(board)}
                          className="bg-gray-300 text-white p-0.5 rounded-md hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBoard(board.id)}
                          className="bg-gray-300 text-white p-0.5 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No boards yet. Create one to get started!</p>
          )}
        </>
      ) : (
        <p className="text-gray-600">
          Please <Link href="/login" className="text-blue-500 hover:underline">login</Link> to view your boards.
        </p>
      )}
    </div>
  );
}