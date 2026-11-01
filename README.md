# social-media-image-sizes

Image sizes for 14 platforms: 55 sizes with safe zones, upload limits and minimum sizes, plus specs for 6 passport and visa photos. As JSON, an npm package, an agent skill and an MCP server. Data under CC BY 4.0.

[Website](https://cropden.com/social-media-image-sizes) · [JSON](https://cropden.com/data/social-media-image-sizes.json) · [中文说明](README.zh-CN.md)

Most size lists stop at width × height. When you crop, you also need to know what the app puts on top of your image: the profile picture over a YouTube banner, the caption bar at the bottom of a Story, the 3:4 profile grid that trims a 4:5 Instagram post. This dataset has those areas in pixels.

## Quick look

One size per row. Each group has more sizes in the data.

| Platform | Image | Size (px) | Ratio | Crop on CropDen |
| --- | --- | --- | --- | --- |
| Instagram | 3:4 portrait post (+3 more) | 1080 × 1440 | 3:4 | [Crop](https://cropden.com/resize/instagram-post) |
| Instagram | Story (+2 more) | 1080 × 1920 | 9:16 | [Crop](https://cropden.com/resize/instagram-story) |
| Instagram | Profile picture (+1 more) | 320 × 320 | 1:1 | [Crop](https://cropden.com/resize/instagram-profile) |
| YouTube | Channel banner (+1 more) | 2560 × 1440 | 16:9 | [Crop](https://cropden.com/resize/youtube-banner) |
| YouTube | Video thumbnail (4K) (+2 more) | 3840 × 2160 | 16:9 | [Crop](https://cropden.com/resize/youtube-thumbnail) |
| YouTube | Short (9:16) (+1 more) | 1080 × 1920 | 9:16 | [Crop](https://cropden.com/resize/youtube-shorts) |
| Facebook | Cover photo (+2 more) | 851 × 315 | 2.70:1 | [Crop](https://cropden.com/resize/facebook-cover) |
| Facebook | Feed post (4:5) (+3 more) | 1080 × 1350 | 4:5 | [Crop](https://cropden.com/social-media-image-sizes#facebook) |
| Discord | Profile banner (+3 more) | 600 × 240 | 5:2 | [Crop](https://cropden.com/resize/discord-banner) |
| Discord | Custom emoji (+2 more) | 128 × 128 | 1:1 | [Crop](https://cropden.com/resize/discord-emoji) |
| LinkedIn | Profile background (+3 more) | 1584 × 396 | 4:1 | [Crop](https://cropden.com/resize/linkedin-banner) |
| X (Twitter) | Header photo (+3 more) | 1500 × 500 | 3:1 | [Crop](https://cropden.com/resize/twitter-header) |
| Twitch | Profile banner (+3 more) | 1200 × 480 | 5:2 | [Crop](https://cropden.com/resize/twitch-banner) |
| TikTok | Video / photo slide (+2 more) | 1080 × 1920 | 9:16 | [Crop](https://cropden.com/resize/tiktok-video) |
| Pinterest | Standard pin (2:3) (+2 more) | 1000 × 1500 | 2:3 | [Crop](https://cropden.com/social-media-image-sizes#pinterest) |
| Snapchat | Story / Spotlight | 1080 × 1920 | 9:16 | [Crop](https://cropden.com/social-media-image-sizes#snapchat) |
| Etsy | Listing photo (4:3) (+2 more) | 3000 × 2250 | 4:3 | [Crop](https://cropden.com/social-media-image-sizes#etsy) |
| Shopify | Product image | 2048 × 2048 | 1:1 | [Crop](https://cropden.com/social-media-image-sizes#shopify) |
| eBay | Listing photo | 1600 × 1600 | 1:1 | [Crop](https://cropden.com/social-media-image-sizes#ebay) |
| Amazon | Main product image | 2000 × 2000 | 1:1 | [Crop](https://cropden.com/social-media-image-sizes#amazon) |

Passport photos ([make one on CropDen](https://cropden.com/resize/passport-photo)):

| Document | Pixels | Print size |
| --- | --- | --- |
| US passport & visa | 600 × 600 | 50.8 × 50.8 mm |
| UK passport | 600 × 771 | 35 × 45 mm |
| EU / Schengen | 600 × 771 | 35 × 45 mm |
| Canada | 600 × 840 | 50 × 70 mm |
| Australia | 600 × 771 | 35 × 45 mm |
| China visa | 600 × 873 | 33 × 48 mm |

All sizes and their zones are in [`data/social-media-image-sizes.json`](data/social-media-image-sizes.json). To crop an image to any of them in your browser, follow the link in the last column.

## Use it

### npm

```sh
npm install social-media-image-sizes
```

```js
import { getSize, groups } from 'social-media-image-sizes';

const post = getSize('instagram-post/portrait-34');
// { width: 1080, height: 1440, ratio: '3:4', exact: true, ... }

const youtube = groups.filter((g) => g.platform === 'YouTube');
```

CommonJS works too: `const { getSize } = require('social-media-image-sizes')`.

### JSON over HTTP

```js
const res = await fetch('https://cropden.com/data/social-media-image-sizes.json');
const { groups, passportPhotos } = await res.json();
```

The endpoint allows cross-origin requests and is cached for an hour.

## Use it with AI agents

### Skill: make images in the right size

[`skills/social-media-image-sizes`](skills/social-media-image-sizes/SKILL.md) is an [Agent Skill](https://agentskills.io) for Claude Code, Codex, Cursor and other agents that read `SKILL.md`. Ask "turn this photo into a YouTube banner" or "what size is an Instagram story?". It picks the size, crops the image on your machine with [sharp](https://sharp.pixelplumbing.com), keeps the file under the upload limit, and draws a preview with the covered areas in red.

```sh
npx skills add geektao1024/social-media-image-sizes
```

Or copy the folder into `~/.claude/skills/` (Claude Code) or your agent's skills folder.

### MCP server: sizes plus AI image tools

CropDen runs a remote MCP server at `https://cropden.com/mcp` (Streamable HTTP).

| Tool                                 | What it does                                                 | Cost                                       |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------ |
| `get_image_sizes`                    | Sizes, safe zones and upload limits from this dataset        | Free, no key                               |
| `ai_extend_image`                    | Extend an image to a wider or taller shape (outpainting)     | 5 credits                 |
| `ai_upscale_image`                   | Upscale 2x or 4x                                             | 8 or 12 credits |
| `ai_remove_background`               | Transparent PNG                                              | 1 credit                |
| `get_ai_task`, `get_credit_balance`  | Check a long run, check your balance                         | Free, needs a key                          |

Claude Code:

```sh
claude mcp add --transport http cropden https://cropden.com/mcp \
  --header "Authorization: Bearer YOUR_CROPDEN_API_KEY"
```

Other clients: add `https://cropden.com/mcp` as a Streamable HTTP server with the same header. Get a key at [cropden.com](https://cropden.com) under Settings → API keys. The AI tools use the same credits as the website, and a failed run is refunded. Without a key, only `get_image_sizes` works.

## What's in an entry

| Field                   | Meaning                                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | `<group>/<size>`, e.g. `youtube-banner/banner`                                                                              |
| `width`, `height`       | Pixels to export                                                                                                           |
| `ratio`                 | Aspect ratio, e.g. `3:4`                                                                                                   |
| `exact`                 | `false` means only the ratio matters                                                                                       |
| `recommended`           | The size we'd pick when a group has several                                                                                |
| `minWidth`, `minHeight` | Smallest upload the platform accepts or needs                                                                              |
| `maxBytes`              | Upload limit in bytes (1 MB = 1,000,000)                                                                                   |
| `zones`                 | Areas in pixels: `safe-area` (keep content inside), `ui-overlay` (covered by the app), `crop-preview` (what another view shows) |
| `zones[].measured`      | Measured in the live app; the platform doesn't publish it                                                                  |
| `zones[].x`, `y`, ...   | Pixels from the top-left of the image. A zone can reach past the edge, like a profile picture that overlaps the bottom of a banner |
| `note`                  | One-line tip, in English and Chinese                                                                                       |

Each group also has `formats`, `facts` (video length and similar), `verified` and a `url` to crop on CropDen. Passport photos add print size in millimetres and head and eye-line ranges as fractions of the photo height.

## How the numbers are checked

- Platform help pages come first. Where a platform publishes nothing (Instagram profile pictures, for example), we use the size current guides agree on.
- Zones with `measured: true` were measured in the apps. Apps move their buttons around, so treat those as guides.
- `verified` is the month a group was last checked. Source links for every group are coming in 0.2.0.
- Found a size that's out of date? Open an issue with a link to the source.

If you only want values the platforms document themselves, use [The Social Specification](https://specification.social), which marks everything else as not documented. This dataset is made for cropping, so it fills those gaps with practical sizes and safe zones.

## On the website

[CropDen](https://cropden.com) does the cropping. Pick a size, see the safe zones over your own image, and export at the exact pixel size and under the upload limit. The crop and resize tools run in your browser. The site also has batch resizing and AI tools: extend, upscale and remove background.

## License

- Data (`data/`, and the same data in `index.js` and `index.cjs`): [CC BY 4.0](LICENSE-DATA.md). Credit it like this: `Image size data by CropDen (https://cropden.com), CC BY 4.0`. On a website, the link is enough.
- Code: [MIT](LICENSE).

## Thanks

[SammaPix](https://github.com/samma1997/sammapix) (MIT) was our starting reference for which platforms and passport photos to cover, and we cross-checked sizes against its data files.

If this saved you a lookup, a star helps other people find it.

Built in public by Geektao ([@geektao0319](https://x.com/geektao0319), posts in Chinese).
