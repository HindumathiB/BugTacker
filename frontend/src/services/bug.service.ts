import { api } from './api';
import { Bug, BugFormValues, BugsResponse } from '../types/bug.types';

export async function fetchBugs(): Promise<BugsResponse> {
  const { data } = await api.get<BugsResponse>('/bugs');
  return data;
}

export async function fetchBugById(id: string): Promise<Bug> {
  const { data } = await api.get<Bug>(`/bugs/${id}`);
  return data;
}

export async function createBugRequest(payload: BugFormValues): Promise<Bug> {
  const { data } = await api.post<Bug>('/bugs', payload);
  return data;
}

export async function updateBugRequest(id: string, payload: BugFormValues): Promise<Bug> {
  const { data } = await api.put<Bug>(`/bugs/${id}`, payload);
  return data;
}

export async function deleteBugRequest(id: string): Promise<void> {
  await api.delete(`/bugs/${id}`);
}
