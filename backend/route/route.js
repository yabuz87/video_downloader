import express from "express";
import { get_vid_info,get_vid,get_meta_data,download_video,download_vid_and_merge_aud,list_vid_quality} from "../controller/conroller.js"
const Router=express.Router();

Router.post("/allVideo",get_vid_info);
Router.get('/stream/video/:id',get_vid);
Router.get('/videoInfo/:videoId',get_meta_data);
Router.get('/videoQuality/:videoId',list_vid_quality);
Router.get('/download/:videoId/:videoItag/:audioItag',download_vid_and_merge_aud);
Router.get('/download/:videoId/:videoItag',download_video);


// Router.get('/download/:videoItag',download_audio);
// /:audioItag


export default Router;