import React, { useState } from 'react';
import VideoGrid from './VideoGrid';
import { useDataStore } from '../store/useDataStore.js';
import VideoDetails from './VideoDetails';

function HomePage({ selectedVideo, setSelectedVideo }) {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const { search } = useDataStore();

  const searchVideos = (query) => {
    console.log("Searching videos with query:", query);
    if (!query.trim()) {
      console.warn("Empty query — not searching.");
      return;
    }

    search(query);
    setQuery('');
    setUrl('');
  };

  const homeStyle = {
    flex: 1,
    marginLeft: '250px',
    padding: '30px',
  };

  const titleStyle = {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#222',
  };

  const formStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  return (
    <div style={homeStyle}>
      <h1 style={titleStyle}>🎬 YouTube Downloader</h1>

      <form
        style={formStyle}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent form reload
          searchVideos(query);
        }}
      >
        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={url}
          style={inputStyle}
          onChange={(e) => {
            setUrl(e.target.value);
            setQuery(e.target.value);
          }}
        />
        <button type="submit" style={buttonStyle}>Search</button>
      </form>

      {selectedVideo ?( selectedVideo &&
        (<VideoDetails 
          videoId={selectedVideo} 
          onBack={() => setSelectedVideo(null)} 
        />)
      ) : (
        <VideoGrid onSelect={setSelectedVideo} />
      )}
    </div>
  );
}

export default HomePage;
