import { useState, useRef, useEffect } from "react";

export default function DropdownMenu({
                                       onEdit,
                                       onDelete,
                                     }: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-200 transition"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-md z-40">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-1 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
