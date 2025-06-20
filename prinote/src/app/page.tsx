"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  date: string;
};

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  // const [keyword, setKeyword] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const [titleKeyword, setTitleKeyword] = useState("");
  const [contentKeyword, setContentKeyword] = useState("");
  const [tagKeyword, setTagKeyword] = useState("");


  const sortedNotes = [...filteredNotes].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 🔄 初期表示：全ノートを読み込んでそのまま表示
  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotes(parsed);
      setFilteredNotes(parsed); // ← 初期表示に全件を設定
    }
  }, []);

  const handleSearch = () => {
    const filtered = notes.filter((note) => {
      const matchTitle =
        titleKeyword === "" ||
        note.title.toLowerCase().includes(titleKeyword.toLowerCase());

      const matchContent =
        contentKeyword === "" ||
        note.content.toLowerCase().includes(contentKeyword.toLowerCase());

      const matchTags =
        tagKeyword === "" ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(tagKeyword.toLowerCase())
        );

      return matchTitle && matchContent && matchTags;
    });

    setFilteredNotes(filtered);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📝 ノート一覧</h1>
      <Link href="/new" className="text-blue-600 underline text-sm">
        ＋ 新規ノートを作成
      </Link>

      <h1 className="text-2xl font-bold">ノート一覧</h1>

      {/* 🔍 検索フォーム */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center space-x-2">
          <label className="font-semibold w-24">タイトル</label>
          <input
            type="text"
            placeholder="タイトル"
            className="border p-2 rounded bg-white w-40"
            value={titleKeyword}
            onChange={(e) => setTitleKeyword(e.target.value)}
          />

            <label className="font-semibold w-24">内容</label>
            <input
              type="text"
              placeholder="内容"
              className="border p-2 rounded bg-white w-40"
              value={contentKeyword}
              onChange={(e) => setContentKeyword(e.target.value)}
            />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold w-24">タグ</label>
          <input
            type="text"
            placeholder="タグ（例: React）"
            className="border p-2 rounded bg-white w-40"
            value={tagKeyword}
            onChange={(e) => setTagKeyword(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 検索実行
        </button>
      </div>

      {/* 区切り線と余白 */}
      <hr className="my-6 border-gray-300" />
      
      {/* 検索結果の表示 */}
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500">該当するノートがありません。</p>
      ) : (
        <ul className="space-y-4">
          {sortedNotes.map((note) => (
            <li key={note.id} className="border rounded p-4 hover:bg-gray-50 transition bg-white">
              <Link href={`/note/${note.id}`}>
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-sm text-gray-600">
                  📁 {note.category} ・ 📅 {note.date}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}