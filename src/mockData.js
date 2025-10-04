// src/data/mockData.js
export const mockSpaces = [
  {
    id: 1,
    title: "React Basics",
    creator: "Alice Doe",
    overview:
      "Belajar dasar-dasar React termasuk komponen, props, dan state management.",
    prerequisites: ["HTML", "CSS", "JavaScript"],
    members: 17,
    lastUpdate: "5 September 2025",
    thumbnail: "https://placehold.co/600x400/333333/FFFFFF.png",
    posts: [1, 2], // post id
    activeUsers: ["Alice", "Bob", "Charlie"],
    related: [2, 3], // space id
  },
  {
    id: 2,
    title: "Advanced JS",
    creator: "Michael Scofield",
    overview:
      "Deep dive ke JavaScript modern: closures, async/await, dan design pattern.",
    prerequisites: ["JavaScript Basics"],
    members: 24,
    lastUpdate: "7 September 2025",
    thumbnail: "https://placehold.co/600x400/333333/FFFFFF.png",
    posts: [3],
    activeUsers: ["Jane", "Tom"],
    related: [1],
  },
  {
    id: 3,
    title: "Machine Learning",
    creator: "Sarah Lee",
    overview: "Pengenalan konsep dasar Machine Learning dan algoritma populer.",
    prerequisites: ["Python", "Math Basics"],
    members: 30,
    lastUpdate: "8 September 2025",
    thumbnail: "https://placehold.co/600x400/333333/FFFFFF.png",
    posts: [],
    activeUsers: [],
    related: [],
  },
];

export const mockPosts = [
  {
    id: 1,
    spaceId: 1,
    title: "JSX & Components",
    author: "Alice",
    date: "2025-09-10",
    content: "Penjelasan dasar JSX dan cara membuat komponen.",
  },
  {
    id: 2,
    spaceId: 1,
    title: "React State Intro",
    author: "Bob",
    date: "2025-09-05",
    content: "Cara menggunakan useState dan pengelolaan state sederhana.",
  },
  {
    id: 3,
    spaceId: 2,
    title: "Closures Explained",
    author: "Jane",
    date: "2025-09-01",
    content: "Mendalami konsep closure di JavaScript.",
  },
];

export const mockComments = [
  {
    id: 1,
    postId: 1,
    user_name: "Charlie",
    content: "Nice explanation! JSX awalnya memang agak membingungkan.",
    created_at: "2025-09-11T10:30:00Z",
    upvotes: 2,
    downvotes: 0,
  },
  {
    id: 2,
    postId: 1,
    user_name: "Bob",
    content: "Aku lebih suka contoh yang pakai functional component.",
    created_at: "2025-09-11T12:00:00Z",
    upvotes: 1,
    downvotes: 0,
  },
  {
    id: 3,
    postId: 2,
    user_name: "Alice",
    content: "useState itu powerful banget kalau dipadukan sama useEffect.",
    created_at: "2025-09-06T09:45:00Z",
    upvotes: 3,
    downvotes: 0,
  },
  {
    id: 4,
    postId: 3,
    user_name: "Tom",
    content: "Closure bikin pusing waktu awal belajar, tapi sangat berguna!",
    created_at: "2025-09-02T15:20:00Z",
    upvotes: 4,
    downvotes: 1,
  },
];