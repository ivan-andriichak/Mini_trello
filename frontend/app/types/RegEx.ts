export type RegisterFormValidatorType = (email: string, password: string, name: string) => string | null;

export const RegisterFormValidator: RegisterFormValidatorType = (email, password, name) => {
  if (!email || !password || !name) return 'All fields are required';
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return 'Invalid email format';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return null;
};

export function validateLogin(email: string, password: string): string | null {
  if (!email || !password) return 'All fields are required';
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return 'Invalid email format';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}