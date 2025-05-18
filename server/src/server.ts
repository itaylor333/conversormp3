import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { createReadStream, unlink } from 'fs';
import { join } from 'path';
import ytdl from 'youtube-dl-exec';

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/download', async (req, res) => {
  const videoUrl = req.query.url as string;

  if (!videoUrl) {
    return res.status(400).send('URL is required');
  }

  try {
    const output = `audio-${Date.now()}.mp3`;

    await ytdl(videoUrl, {
      output,
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0,
    });

    const filePath = join(__dirname, '..', output);
    res.setHeader('Content-Disposition', `attachment; filename="audio.mp3"`);

    const stream = createReadStream(filePath);
    stream.pipe(res);

    stream.on('close', () => {
      unlink(filePath, () => {});
    });
  } catch (error) {
    console.error('Erro na conversão:', error);
    res.status(500).send('Failed to convert video');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
