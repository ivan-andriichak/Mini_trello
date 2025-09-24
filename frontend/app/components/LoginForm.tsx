'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from "./ui/Input";
import { ErrorMessage } from "./ui/ErrorMessage";
import { validateLogin } from "../types/RegEx";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push('/boards');
    } catch (err: unknown) {
      setError(typeof err === "object" && err && "message" in err ? (err as Error).message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.replace(/\s+/g, ''))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-24 relative"
            required
          />
          <div className="mt-3 flex items-center">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-1 accent-green-600 h-6 w-6"
            />
            <label htmlFor="show-password" className="text-xs text-gray-600 select-none">Show password</label>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-400 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">Register</a>
      </p>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
