import Link from "next/link";
import {Button} from "./components/ui/Button";

export default function Home() {
  return (
   <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700 drop-shadow">Welcome to Mini-Trello</h1>
      <p className="mb-6 text-lg text-gray-700">Organize your tasks with boards, columns, and cards.</p>
    <Link href="/boards">
      <Button>
        Go to Boards
        <span className="ml-2">&#8594;</span>
      </Button>
    </Link>
    </div>
  );
}