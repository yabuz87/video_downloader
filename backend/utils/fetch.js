import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY =process.env.GOOGLE_API_KEY

 export const fetchYouTubeVideos = async (query) => {
  const url = 'https://www.googleapis.com/youtube/v3/search';

  try {
    console.log(API_KEY);
    console.log(query)
    const response = await axios.get(url, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 10,
        key: API_KEY,
      },
    });

    const videos = response.data.items;
    console.log("YouTube Search Results:", videos);
    return videos;
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error);
  }
};

// Example usage
// fetchYouTubeVideos('react native');
