import React, { useRef, useEffect, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

const NOTE_POSITIONS = [
  'c5', 'b4', 'a4', 'g4', 'f4', 'e4', 'd4', 'c4', 'b3', 'a3', 'g3',
];

const Score: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [notes1, setNotes1] = useState<string[]>([]);
  const [notes2, setNotes2] = useState<string[]>([]);

  // Y座標から音符名を返す（単純なマッピング）
  const getNoteFromY = (y: number) => {
    const index = Math.floor((y - 40) / 10);
    return NOTE_POSITIONS[index] || 'c4';
  };

  // クリックで音符追加
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const note = getNoteFromY(y);

    if (y < 120) {
      setNotes1((prev) => [...prev, note]);
    } else {
      setNotes2((prev) => [...prev, note]);
    }
  };

  // 五線譜と音符描画
  const renderStaves = () => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(500, 250);
    const context = renderer.getContext();

    const stave1 = new Stave(10, 40, 450);
    stave1.addClef('treble').setContext(context).draw();

    const stave2 = new Stave(10, 140, 450);
    stave2.addClef('treble').setContext(context).draw();

    // 音符を作成
    const createNotes = (notes: string[]) =>
      notes.map(
        (note) =>
          new StaveNote({
            keys: [note.toLowerCase()],
            duration: 'q',
          })
      );

    const voice1 = new Voice({ numBeats: 4, beatValue: 4 });
    voice1.setStrict(false);
    voice1.addTickables(createNotes(notes1));

    const voice2 = new Voice({ numBeats: 4, beatValue: 4 });
    voice2.setStrict(false);
    voice2.addTickables(createNotes(notes2));

    new Formatter().joinVoices([voice1]).format([voice1], 400);
    new Formatter().joinVoices([voice2]).format([voice2], 400);

    voice1.draw(context, stave1);
    voice2.draw(context, stave2);
  };

  useEffect(() => {
    renderStaves();
  }, [notes1, notes2]);

  return (
    <div>
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{ border: '1px solid black', width: 500, height: 250, cursor: 'pointer' }}
      />
      <button
        onClick={() => {
          setNotes1([]);
          setNotes2([]);
        }}
        style={{ marginTop: 10 }}
      >
        クリア
      </button>
    </div>
  );
};

export default Score;