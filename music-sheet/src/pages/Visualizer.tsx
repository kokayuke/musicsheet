import { useRef, useEffect, useState } from 'react';
import Button from '@mui/material/Button'; //MUI
import Stack from '@mui/material/Stack'; //MUI

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [started, setStarted] = useState(false);

  const handleForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      audioRef.current.currentTime + 10,
      audioRef.current.duration
    );
  };
  const handleBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };
  const startAudio = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const audioCtx = audioCtxRef.current!;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const audio = audioRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    if (!sourceRef.current) {
      sourceRef.current = audioCtx.createMediaElementSource(audio);
    }

    const analyser = audioCtx.createAnalyser();
    sourceRef.current.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
      }
    }

    draw();
    setStarted(true);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={500} height={200} />
      <div>
        {/* <audio ref={audioRef} controls src="/20250608_05_課題曲通し.mp3" /> */}
        <audio ref={audioRef} controls src="/20250608_03_合奏2-自由曲-.mp3" 
            style={{ width: '100%' }} // 横幅を100%に　
        />
        
        <Stack direction="row" spacing={2} marginTop={2}>
            <Button variant="contained" color="primary" onClick={handleBackward}>
            戻す 10秒
            </Button>
            <Button variant="contained" color="secondary" onClick={handleForward}>
            早送り 10秒
            </Button>
        </Stack>
      </div>
      {/*         
      <div>
        <Button variant="outlined" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="text" color="error">Error</Button>
        <Button variant="outlined" color="success">Success</Button>
        <Button variant="contained" color="warning">Warning</Button>
        <Button variant="text" sx={{
            backgroundColor: '#f06292', // ピンク系
            color: '#fff',
            '&:hover': {
            backgroundColor: '#ec407a', // ホバー時
            },
        }}>Info</Button>
      </div> */}
      {!started && (
        <Button variant="contained" color="primary" onClick={startAudio} style={{ marginTop: '10px' }}>
          🎧 スタート
        </Button>

        
      )}
    </div>
  );
}