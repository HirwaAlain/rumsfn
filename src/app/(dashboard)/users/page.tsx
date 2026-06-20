import { UsersClient } from "@/components/users/UsersClient";
import { serverFetch } from "@/lib/api/server";
import { users as mockUsers } from "@/lib/mock-data/mock-users";
import type { User } from "@/types";

interface Page<T> { content: T[]; }

async function fetchUsers(): Promise<User[]> {
  try {
    const data = await serverFetch<Page<User>>("/users?page=0&size=100&sort=createdAt,desc");
    return data.content;
  } catch {
    return mockUsers;
  }
}

export default async function UsersPage() {
  const users = await fetchUsers();
  return <UsersClient users={users} />;
}
