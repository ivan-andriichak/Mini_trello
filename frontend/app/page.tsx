import Link from "next/link";

export default function Home() {
  return (
   <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700 drop-shadow">Welcome to Mini-Trello</h1>
      <p className="mb-6 text-lg text-gray-700">Organize your tasks with boards, columns, and cards.</p>
     <Link
       href="/boards"
       className="inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-600 transition mb-2"
     >
       Go to Boards
       <span className="ml-2">&#8594;</span>
     </Link>
    </div>
  );
}