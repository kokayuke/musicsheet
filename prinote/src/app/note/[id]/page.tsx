"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Note = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  date: string;
};


export default function NoteDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (!stored || !id) return;

    const notes: Note[] = JSON.parse(stored);
    const found = notes.find((n) => n.id === id);
    if (found) {
      setNote(found);
    }
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    const stored = localStorage.getItem("notes");
    if (!stored) return;

    const notes: Note[] = JSON.parse(stored);
    const filtered = notes.filter((n) => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(filtered));

    router.push("/"); // 一覧ページへ戻る
  };

  if (!note) return <p className="p-4">読み込み中...</p>;

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">{note.title}</h1>
      <p className="text-sm text-gray-500">
        📁 {note.category} ・ 📅 {note.date}
      </p>
      <hr className="my-6 border-gray-300" />
      <div className="whitespace-pre-wrap pt-4">{note.content}</div>

      {/* 一覧に戻るボタン */}
      <div className="mt-6 flex items-center space-x-2">
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← 一覧に戻る
        </Link>
        <Link href={`/note/${note.id}/edit`} 
          className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ✏️ 編集する
        </Link>
        <button
          onClick={handleDelete}
          className="ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          削除する
        </button>
      </div>
    </main>
  );
}