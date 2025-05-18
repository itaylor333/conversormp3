import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');

  const handleDownload = () => {
    if (!url) return alert("A URL não é válido");
    window.open(`http://localhost:4000/download?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Conversor para MP3</h1>
      <input
        type="text"
        placeholder="Cole aqui a URL do video"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleDownload} style={{ padding: '10px 20px' }}>
        Converter e Baixar
      </button>
    </div>
  );
}

export default App;