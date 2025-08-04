import { create } from 'zustand';
import { axiosInstance } from '../utils/axois.js';

export const useDataStore = create((set) => ({
  videoLists: [],
  isSearchingVideos: false,
  singleVideo: {},
  vidId:null,
  setVideoId:(videoId) => set({ vidId: videoId }),
  isSingleVideoLoading: false,

  search: async (query) => {
    try {
      set({ isSearchingVideos: true });
      console.log("Searching for videos with query:", query);

      const res = await axiosInstance.post('/allVideo', { query });

      if (res.data && res.data.length > 0) {
        set({ videoLists: res.data });
      } else {
        console.warn("No videos found");
      }
    } catch (error) {
      console.error("Error searching videos:", error?.response || error);
    } finally {
      set({ isSearchingVideos: false });
    }
  },

  // 🎥 Get details for a single video
  getSingleVideo: async (videoId) => {
    try {
      set({ isSingleVideoLoading: true });
      const res = await axiosInstance.get(`/videoInfo/${videoId}`);
      if (res.data) {
        set({ singleVideo: res.data });
      }
    } catch (error) {
      console.error("Error fetching video:", error?.response || error);
    } finally {
      set({ isSingleVideoLoading: false });
    }
  },

  fetchLiveStreamUrl: async (videoId) => {
    try {
      const res = await axiosInstance.get(`/stream/video/${videoId}`);
      return res.data?.url || null;
    } catch (error) {
      console.error("Error fetching live stream:", error?.response || error);
      return null;
    }
  },

  // ⬇️ Trigger download
  downloadVideo: async (videoId, quality) => {
    try {
      const downloadUrl = await axiosInstance.get(`/download/${videoId}/${quality}`);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Download failed:", error?.response || error);
    }
  },
}));
