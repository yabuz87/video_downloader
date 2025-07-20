import React from 'react';

function Sidebar() {
  const sidebarStyle = {
    width: '220px',
    backgroundColor: '#1e1e2f',
    color: 'white',
    padding: '20px',
    position: 'fixed',
    height: '100%',
    overflowY: 'auto'
  };

  const ulStyle = { listStyle: 'none', padding: 0 };
  const liStyle = {
    margin: '10px 0',
    padding: '6px 8px',
    background: '#2a2a40',
    borderRadius: '4px'
  };

  return (
    <div style={sidebarStyle}>
      <h2>📂 Downloads</h2>
      <ul style={ulStyle}>
        <li style={liStyle}>video1.mp4</li>
        <li style={liStyle}>video2.mp4</li>
        <li style={liStyle}>video3.mp4</li>
        {/* Replace with real download history */}
      </ul>
    </div>
  );
}

export default Sidebar;
