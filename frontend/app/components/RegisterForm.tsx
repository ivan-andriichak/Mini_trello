'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from "./ui/Input";
import { ErrorMessage } from "./ui/ErrorMessage";
import { RegisterFormValidator } from "../types/RegEx";

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = RegisterFormValidator(email, password, name);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    try {
      await register({ email, password, name });
      router.push('/boards');
    } catch (err: unknown) {
      setError(typeof err === "object" && err && "message" in err ? (err as Error).message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <ErrorMessage message={error} />}
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </p>
    </div>
  );
}