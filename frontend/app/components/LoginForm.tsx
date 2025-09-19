'use client';

import {FormEvent, useState} from 'react';
import {useAuth} from './AuthContext';
import {useRouter} from 'next/navigation';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push('/boards');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <div >
            <input
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
        <button type="submit" className="w-full bg-blue-500
         text-white p-2 rounded-md hover:bg-blue-400
         hover:transition duration-300
         hover:text-black
         ">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">Register</a>
      </p>
    </div>
  );
}