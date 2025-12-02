"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function LiveStream() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = "http://localhost:8000/stream/stream.m3u8";

    // If HLS.js is supported (Chrome, Edge, Firefox)
    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDuration: 1,
        maxLatency: 2,
        liveMaxLatencyDuration: 3,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => hls.destroy();
    }

    // Native HLS: Safari / iOS
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.play();
    }
  }, []);

  return (
    <div
      style={{
        background: "#0b1020",
        color: "white",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        style={{
          width: "80vw",
          maxWidth: "900px",
          background: "black",
          borderRadius: "6px",
        }}
      />
    </div>
  );
}
