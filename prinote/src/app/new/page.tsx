"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type Note = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  date: string;
};

export default function NewNotePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const newNote: Note = {
      id: uuidv4(), // ← ユニークなIDを自動生成！
      title,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
      content,
      date: new Date().toISOString().split("T")[0],
    };

    const stored = localStorage.getItem("notes");
    const notes: Note[] = stored ? JSON.parse(stored) : [];
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    router.push("/");
  };

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">新しいノートを作成</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="カテゴリ"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="タグ (カンマ区切り)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded h-40"
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        保存
      </button>
    </main>
  );
}