<div style="text-align: center;">
    <img src="https://i.postimg.cc/sXx2CgB7/yt-dlx-removebg.png" alt="yt-dlx Logo">
</div>

# yt-dlx: elevate your video downloading & streaming experience

[![npm version](https://img.shields.io/npm/v/yt-dlx.svg)](https://www.npmjs.com/package/yt-dlx)
![license](https://img.shields.io/npm/l/yt-dlx.svg)

## overview

yt-dlx is a powerful video downloading tool designed to enhance your media experience. with a combination of features inspired by python-yt-dlp, python-youtube-dl, puppeteer & playwright, yt-dlx offers a comprehensive solution for effortlessly downloading audio and video content from various sources.

## key features

- **effortless downloads**: streamline your audio/video downloads with yt-dlx's intuitive command-line interface.
- **feature-rich package**: benefit from a rich set of functionalities inherited from popular tools like youtube-dl and python yt-dlp.
- **continuous evolution**: stay up-to-date with state-of-the-art functionalities and enhancements to elevate your media experience.

## installation

to install yt-dlx, simply use any package manager you like:

- bun add yt-dlx
- yarn add yt-dlx
- pnpm add yt-dlx
- npm install yt-dlx

## usage

using yt-dlx is very verbosed. Here are all the functions provided by yt-dlx

```ts
import ytdlx from "yt-dlx";

// Downloading Only Audio.
await ytdlx.audio.single.highest({
  query: "",
});
await ytdlx.audio.single.lowest({
  query: "",
});
await ytdlx.audio.single.custom({
  query: "",
});
```

```ts
// Downloading Only Video.
await ytdlx.video.single.highest({
  query: "",
});
await ytdlx.video.single.lowest({
  query: "",
});
await ytdlx.video.single.custom({
  query: "",
});
```

```ts
// Downloading mix Audio + Video.
await ytdlx.audio_video.single.highest({
  query: "",
});
await ytdlx.audio_video.single.lowest({
  query: "",
});
```

## get involved

we welcome contributions and feedback! if you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/...) or [submit a pull request](https://github.com/...).
