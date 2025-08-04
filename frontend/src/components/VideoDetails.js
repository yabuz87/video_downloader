import React, { useEffect, useState } from 'react';
import { dateFormatter } from '../utils/utils.js';
import { formatViews } from '../utils/utils.js'; // Make sure your formatViews works as shown below
import { useDataStore } from '../store/useDataStore.js';

function VideoDetails({ videoId, onBack }) {
  const [selectedQuality, setSelectedQuality] = useState({});
  const { singleVideo, isSingleVideoLoading, getSingleVideo,videoLists,downloadVideo} = useDataStore();
  const selectedVideo = videoLists.find(v => v.id.videoId === videoId) || {};

  useEffect(() => {
    getSingleVideo(videoId);
    console.log("this is a single video ",singleVideo);
  }, [videoId, getSingleVideo]);

   const download=async()=>
   {
        console.log("selected quality", selectedQuality);
        if (selectedQuality.itag!== undefined && selectedQuality.itag !== null) {
          
        await downloadVideo(videoId, selectedQuality.itag);
    }else {
      console.warn("No quality selected for download");}
   }

  if (isSingleVideoLoading || !singleVideo) {
    return <p style={{ textAlign: 'center' }}>Loading video...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        <iframe
          key={videoId} // important for React to reset iframe when videoId changes
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={styles.iframe}
        />
      </div>

      <h2 style={styles.title}>{singleVideo.title || 'Untitled Video'}</h2>

      <div style={styles.stats}>
        <div style={styles.statsMain}>
          <span>👁️ {formatViews(singleVideo.views)} views</span>
          <span>📅 {dateFormatter(selectedVideo.snippet.publishedAt)|| 'Unknown'}</span>
        </div>

        <div style={styles.channelInfo}>
          <p><strong>Channel:</strong> {singleVideo.channel}</p>
          <p><strong>Description:</strong> {selectedVideo.snippet.description || 'No description available'}</p>
          <p><strong>Duration:</strong> {singleVideo.duration}</p>
        </div>
      </div>

      <div style={styles.controls}>
        <label htmlFor="quality">Download Quality:</label>
        <select
  id="quality"
  value={selectedQuality.itag || ''}
  onChange={(e) => {
    const selected = singleVideo.resolutions.find(r => r.itag === e.target.value);
    setSelectedQuality(selected);
  }}
  style={styles.select}
>
  {singleVideo.resolutions?.map((q) => (
    <option key={q.itag} value={q.itag}>
      {q.quality} | {q.ext.toUpperCase()} | {q.filesize}
    </option>
  ))}
</select>

        <button onClick={download} style={styles.downloadBtn}>⬇️ Download</button>
      </div>

      <button onClick={onBack} style={styles.backBtn}>← Back</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 ratio
    height: 0,
    overflow: 'hidden',
    marginBottom: 20,
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  stats: {
    marginBottom: 20,
  },
  statsMain: {
    display: 'flex',
    gap: 20,
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  channelInfo: {
    fontSize: 14,
    color: '#777',
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  select: {
    padding: 8,
    fontSize: 14,
  },
  downloadBtn: {
    padding: '10px 16px',
    fontSize: 14,
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  backBtn: {
    marginTop: 30,
    padding: '8px 12px',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

export default VideoDetails;
