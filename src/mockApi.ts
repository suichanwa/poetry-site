// src/mockApi.ts
import {
  mockUser,
  mockCommunities,
  mockPoems,
  mockManga,
  mockLightNovels,
} from "./mockData";

export const mockApi = {
  getUser: async () => {
    return mockUser;
  },
  getCommunities: async () => {
    return mockCommunities;
  },
  getPoems: async () => {
    return mockPoems;
  },
  getManga: async () => {
    return mockManga;
  },
  getLightNovels: async () => {
    return mockLightNovels;
  },
  // Add more mock API functions as needed
};