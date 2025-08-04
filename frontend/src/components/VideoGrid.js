import React from 'react';
import { useDataStore } from '../store/useDataStore.js';
import { dateFormatter } from '../utils/utils.js';

function VideoGrid({ onSelect }) {
  const { videoLists, isSearchingVideos,setVideoId,vidId } = useDataStore();



  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  const imgStyle = {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
  };

  const contentStyle = {
    padding: '10px',
  };

  return (
    <div style={gridStyle}>
      {isSearchingVideos ? (
        <p>Loading videos...</p>
      ) : (
        videoLists.map((video) => {
          const videoId = video.id.videoId || video.id; // Safe access
          return (
            <div
  key={videoId}
  style={cardStyle}
  onClick={() => onSelect(videoId)} // ✅ this is the correct form
>
  <img
    src={video.snippet.thumbnails.high.url}
    alt={video.snippet.title}
    style={imgStyle}
  />
  <div style={contentStyle}>
    <h4>{video.snippet.title}</h4>
    <p style={{ fontSize: '15px', color: '#555' }}>
      Channel • {video.snippet.channelTitle}<br />
      Date • {dateFormatter(video.snippet.publishedAt)}
    </p>
  </div>
</div>

          );
        })
      )}
    </div>
  );
}

export default VideoGrid;
