 import {fetchYouTubeVideos} from "../utils/fetch.js"
 import fs from 'fs';
 import { spawn } from 'child_process';
 import { exec } from 'child_process';
import util from 'util';
import path from 'path';
const execPromise = util.promisify(exec);
 
  const get_vid_info=async(req,res)=>
 {
    try {
          const {query}=req.body;
           if (!query) {
       return res.status(400).json({ message: "Missing search query in request body" });
              }
          const videos=await fetchYouTubeVideos(query)
          res.json(videos);

        } catch (error) {
        console.log({"message":error.message})
        res.json({"message":"there is error in fetching videos"})
    }
 }
  const get_vid=async(req, res) => {
  const { videoId } = req.params;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  res.header('Content-Disposition', 'inline'); // Stream, not download
  ytdl(videoUrl, { quality: '18' }) // 18 = 360p mp4
    .pipe(res);
}




// Metadata fetch using yt-dlp
 const get_meta_data = async (req, res) => {
  try {
    let { videoId } = req.params;

    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing videoId' });
    }

    videoId = videoId.trim();
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const { stdout } = await execPromise(`yt-dlp --dump-json ${videoUrl}`);
    const info = JSON.parse(stdout);

    const progressiveFormats = info.formats.filter(f =>
      f.vcodec !== 'none' || f.acodec !== 'none'
    );

    // 🛠 Map the clean metadata

    const resolutions = progressiveFormats.map(f => ({
      itag: f.format_id,
      quality: f.format_note || (f.height ? `${f.height}p` : 'unknown'),
      ext: f.ext,
      fps: f.fps || 'N/A',
      container: f.container || f.ext,
      filesize: f.filesize ? (f.filesize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A',
    }));

    const metadata = {
      title: info.title,
      channel: info.uploader,
      views: info.view_count,
      duration: `${Math.floor(info.duration / 60)}m ${info.duration % 60}s`,
      resolutions
    };

    res.status(200).json(metadata);

  } catch (err) {
    console.error('❌ Failed to fetch video info:', err.message);
    res.status(500).json({ error: err.message });
  }
};


const list_vid_quality = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ message: "Missing videoId" });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const { stdout } = await execPromise(`yt-dlp --print-json ${videoUrl}`);
    const info = JSON.parse(stdout);

    const formats = info.formats;

    // Filter video-only formats
    const videoFormats = formats.filter(f =>
      f.vcodec !== 'none' && f.acodec === 'none'
    );

    // Filter audio-only formats
    const audioFormats = formats.filter(f =>
      f.vcodec === 'none' && f.acodec !== 'none'
    );

    // Match compatible pairs (same container/extension)
    const compatiblePairs = [];

    videoFormats.forEach(video => {
      audioFormats.forEach(audio => {
        // Match container (e.g., both 'mp4' or both 'webm')
        if (video.ext === audio.ext) {
          compatiblePairs.push({
            video_itag: video.format_id,
            audio_itag: audio.format_id,
            video_quality: video.format_note || (video.height ? `${video.height}p` : 'unknown'),
            audio_quality: audio.format_note || 'audio',
            container: video.ext,
            combined_filesize: video.filesize && audio.filesize
              ? ((video.filesize + audio.filesize) / 1024 / 1024).toFixed(2) + ' MB'
              : 'N/A'
          });
        }
      });
    });

    res.status(200).json(compatiblePairs);

  } catch (error) {
    console.error("❌ Format compatibility error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const download_video = async (req, res) => {
  try {
    const { videoId, videoItag } = req.params;

    if (!videoId || !videoItag) {
      return res.status(400).json({ error: 'Missing videoId or itag' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const downloadDir = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', 'YT_vid_downloads');

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Get and sanitize the title
    const { stdout: titleOut } = await execPromise(`yt-dlp --get-title ${videoUrl}`);
    const safeTitle = titleOut.trim().replace(/[\/\\?%*:|"<>]/g, '-');
    const outputPath = path.join(downloadDir, `${safeTitle}.mp4`);

    // Setup args for spawn
    const args = ['-f', videoItag, '-o', outputPath, videoUrl];
    console.log('▶️ Running yt-dlp with args:', args);

    const dl = spawn('yt-dlp', args);

    dl.stdout.on('data', (data) => {
      console.log(`📤 yt-dlp: ${data.toString().trim()}`);
    });

    dl.stderr.on('data', (data) => {
      console.error(`⚠️ stderr: ${data.toString().trim()}`);
    });

    dl.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Download complete:', outputPath);
        res.status(200).json({ message: 'Download complete', path: outputPath });
      } else {
        console.error('❌ yt-dlp exited with code:', code);
        res.status(500).json({ error: `yt-dlp failed with code ${code}` });
      }
    });

  } catch (err) {
    console.error('❌ Error during download:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const download_vid_and_merge_aud = async (req, res) => {
  try {
    const { videoId, videoItag, audioItag } = req.params;

    if (!videoId || !videoItag) {
      return res.status(400).json({ error: 'Missing videoId or videoItag' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;


    const downloadDir = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', 'YT_vid_downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Get title for output filename
    const titleCmd = spawn('yt-dlp', ['--get-title', videoUrl]);

    let videoTitle = '';
    for await (const chunk of titleCmd.stdout) {
      videoTitle += chunk.toString();
    }

    videoTitle = videoTitle.trim().replace(/[\/\\?%*:|"<>]/g, '-');
    const outputPath = path.join(downloadDir, `${videoTitle}.mp4`);

    // 📦 Construct format string
    const format = audioItag ? `${videoItag}+${audioItag}` : videoItag;

    const args = ['-f', format, '-o', outputPath, videoUrl];
    console.log('▶️ Download command:', `yt-dlp ${args.join(' ')}`);

    const dl = spawn('yt-dlp', args);

    dl.stdout.on('data', (data) => {
      console.log(`📤 yt-dlp: ${data.toString().trim()}`);
    });

    dl.stderr.on('data', (data) => {
      console.error(`⚠️ stderr: ${data.toString().trim()}`);
    });

    dl.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Download and merge complete!');
        res.json({ message: 'Download complete', path: outputPath });
      } else {
        console.error('❌ yt-dlp exited with code:', code);
        res.status(500).json({ error: `yt-dlp failed with code ${code}` });
      }
    });

  } catch (err) {
    console.error('❌ Download error:', err.message);
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
};



 export  {get_vid_info,get_vid,get_meta_data,download_video,download_vid_and_merge_aud,list_vid_quality}


