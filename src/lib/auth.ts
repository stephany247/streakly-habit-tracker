import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

import {
  USERS_KEY,
  SESSION_KEY,
  HABITS_KEY,
} from './constants';

import {
  getStorageItem,
  setStorageItem,
} from './storage';

export function getUsers(): User[] {
  return getStorageItem<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]): void {
  setStorageItem(USERS_KEY, users);
}

export function getSession(): Session | null {
  return getStorageItem<Session | null>(
    SESSION_KEY,
    null
  );
}

export function saveSession(
  session: Session | null
): void {
  setStorageItem(SESSION_KEY, session);
}

export function clearSession(): void {
  setStorageItem(SESSION_KEY, null);
}

export function getHabits(): Habit[] {
  return getStorageItem<Habit[]>(HABITS_KEY, []);
}

export function saveHabits(
  habits: Habit[]
): void {
  setStorageItem(HABITS_KEY, habits);
}