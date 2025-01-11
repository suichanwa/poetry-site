// src/mockData.ts
export const mockUser = {
  id: 1,
  name: "Test User",
  email: "testuser@example.com",
  avatar: "/path/to/avatar.png",
  bio: "This is a test user.",
};

export const mockCommunities = [
  {
    id: 1,
    name: "Test Community",
    description: "This is a test community.",
    avatar: "/path/to/community-avatar.png",
    createdAt: new Date().toISOString(),
    _count: {
      members: 10,
      posts: 5,
    },
  },
  // Add more mock communities as needed
];

export const mockPoems = [
  {
    id: 1,
    title: "Test Poem",
    content: "This is a test poem.",
    author: mockUser,
    createdAt: new Date().toISOString(),
    tags: [{ name: "test" }],
  },
  // Add more mock poems as needed
];

export const mockManga = [
  {
    id: 1,
    title: "Test Manga",
    description: "This is a test manga.",
    coverImage: "/path/to/manga-cover.png",
    author: mockUser,
    chapters: [
      {
        id: 1,
        title: "Chapter 1",
        orderIndex: 1,
      },
    ],
  },
  // Add more mock manga as needed
];

export const mockLightNovels = [
  {
    id: 1,
    title: "Test Light Novel",
    description: "This is a test light novel.",
    coverImage: "/path/to/light-novel-cover.png",
    author: mockUser,
    chapters: [
      {
        id: 1,
        title: "Chapter 1",
        orderIndex: 1,
      },
    ],
  },
  // Add more mock light novels as needed
];