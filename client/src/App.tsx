import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'mp3' | 'mp4'>('mp3');
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    try {
      const res = await fetch(
        `https://backendcmp3.onrender.com/download?url=${encodeURIComponent(url)}&format=${format}`
      );

      if (!res.ok) {
        alert('Erro ao baixar o arquivo');
        return;
      }

      const contentLength = res.headers.get('Content-Length');
      const disposition = res.headers.get('Content-Disposition');

      let filename = `video.${format}`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      if (!contentLength) {
        alert('Não foi possível obter o tamanho do arquivo.');
        return;
      }

      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = res.body!.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          loaded += value.length;
          setProgress(Math.floor((loaded / total) * 100));
        }
      }

      const blob = new Blob(chunks);
      const urlBlob = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(urlBlob);
      setProgress(0);
    } catch (error) {
      alert('Erro inesperado ao baixar o arquivo');
      console.error(error);
      setProgress(0);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Conversor Youtube</h1>
      <input
        type="text"
        placeholder="Cole aqui a URL do Youtube"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="radio"
            name="format"
            value="mp3"
            checked={format === 'mp3'}
            onChange={() => setFormat('mp3')}
          />
          MP3
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="format"
            value="mp4"
            checked={format === 'mp4'}
            onChange={() => setFormat('mp4')}
          />
          MP4
        </label>
      </div>

      <button onClick={handleDownload}>Converter e Baixar</button>

      {progress > 0 && (
        <div style={{ marginTop: 20, width: '100%', background: '#eee', borderRadius: 8, height: 20 }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#4f46e5',
              borderRadius: 8,
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;