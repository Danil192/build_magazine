import { create } from 'zustand';
import { WorkLog, WorkType } from '@/types';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

interface JournalState {
  logs: WorkLog[];
  workTypes: WorkType[];
  isLoading: boolean;
  fetchLogs: (date?: string) => Promise<void>;
  fetchWorkTypes: () => Promise<void>;
  addLog: (log: Omit<WorkLog, 'id'>) => Promise<void>;
  deleteLog: (id: number) => Promise<void>;
  addWorkType: (type: Omit<WorkType, 'id'>) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  logs: [],
  workTypes: [],
  isLoading: false,

  fetchLogs: async (date) => {
    set({ isLoading: true });
    const url = date ? `${API_URL}/work-logs/?date=${date}` : `${API_URL}/work-logs/`;
    const res = await axios.get(url);
    set({ logs: res.data, isLoading: false });
  },

  fetchWorkTypes: async () => {
    const res = await axios.get(`${API_URL}/work-types/`);
    set({ workTypes: res.data });
  },

  addLog: async (log) => {
    await axios.post(`${API_URL}/work-logs/`, log);
    get().fetchLogs();
  },

  deleteLog: async (id) => {
    await axios.delete(`${API_URL}/work-logs/${id}/`);
    set({ logs: get().logs.filter(l => l.id !== id) });
  },

  addWorkType: async (type) => {
    await axios.post(`${API_URL}/work-types/`, type);
    get().fetchWorkTypes();
  }
}));