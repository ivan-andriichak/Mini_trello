export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Mini-Trello</h1>
      <p className="mb-4">Organize your tasks with boards, columns, and cards.</p>
      <p>
        <a href="/login" className="text-blue-500 hover:underline">Login</a> or{' '}
        <a href="/register" className="text-blue-500 hover:underline">Register</a> to get started.
      </p>
    </div>
  );
}