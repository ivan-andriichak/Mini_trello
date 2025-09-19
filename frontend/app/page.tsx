export default function Home() {
  return (
   <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700 drop-shadow">Welcome to Mini-Trello</h1>
      <p className="mb-6 text-lg text-gray-700">Organize your tasks with boards, columns, and cards.</p>
      <p className="flex gap-4 items-center">
        <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Login</a>
        <span className="text-gray-500">or</span>
        <a href="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Register</a>
        <span className="ml-2 text-sm text-gray-400">to get started.</span>
      </p>
    </div>
  );
}