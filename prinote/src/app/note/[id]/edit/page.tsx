"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Combobox } from '@headlessui/react';

type Note = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  date: string;
};


const categories = ['勉強', '音楽', '生活', 'アイデア'];

function CategorySelect({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? categories
      : categories.filter((c) => c.includes(query));

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          className="w-full border p-2 rounded bg-white"
          // onChange={(event) => setQuery(event.target.value)}

          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);               // フィルタ用の状態を更新
            onChange(value);               // 外部にカテゴリ値として渡す（＝note.category にセット）
          }}
          displayValue={(cat: string) => cat}
          placeholder="カテゴリを入力"
        />
        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto border bg-white rounded shadow">
          {filtered.map((category) => (
            <Combobox.Option
              key={category}
              value={category}
              className={({ active }) =>
                `cursor-pointer p-2 ${active ? 'bg-blue-100' : ''}`
              }
            >
              {category}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

export default function EditNotePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (!stored || !id) return;

    const notes: Note[] = JSON.parse(stored);
    const found = notes.find((n) => n.id === id);
    if (found) setNote(found);
  }, [id]);

  const handleSave = () => {
    if (!note) return;

    const stored = localStorage.getItem("notes");
    const notes: Note[] = stored ? JSON.parse(stored) : [];

    const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push(`/note/${note.id}`);
  };

  if (!note) return <p className="p-4">読み込み中...</p>;

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">ノートを編集</h1>

      <div className="flex items-center space-x-2">
        <label className="font-semibold w-24">タイトル</label>
        <input
          className="flex-1 border p-2 rounded bg-white"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
      </div>


      <div className="flex items-center space-x-2">
        <label className="font-semibold w-24">カテゴリ</label>
        <CategorySelect
          value={note.category}
          onChange={(val) => setNote({ ...note, category: val })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="font-semibold w-24">タグ？</label>
        <input
          className="flex-1 border p-2 rounded bg-white"
          value={note.tags.join(", ")}
          onChange={(e) =>
            setNote({
              ...note,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }   
        /> 
      </div>

      <hr className="my-6 border-gray-300" />
      
      <div className="flex items-start space-x-2">
        <label className="font-semibold w-24 pt-2">内容</label>
        <textarea
          className="flex-1 border p-2 rounded bg-white h-40"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        保存
      </button>
    </main>
  );
}