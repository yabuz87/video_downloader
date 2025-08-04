import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/sidebar';
import HomePage from './components/Home';
import VideoDetails from './components/VideoDetails';



function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="app-container">
      <Sidebar />
      <HomePage 
        selectedVideo={selectedVideo} 
        setSelectedVideo={setSelectedVideo} 
      />
      {/* {selectedVideo && (
        // <VideoDetails 
        //   videoId={selectedVideo} 
        //   onBack={() => setSelectedVideo(null)} 
        // />
      )} */}
    </div>
  );
}

export default App;
