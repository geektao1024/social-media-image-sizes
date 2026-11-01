# social-media-image-sizes

14 个平台的图片尺寸，共 55 个，带安全区、上传大小上限和最小尺寸；另有 6 种护照和签证照片的规格。提供 JSON、npm 包、AI skill 和 MCP 服务，数据采用 CC BY 4.0。

[网站](https://cropden.com/zh/social-media-image-sizes) · [JSON](https://cropden.com/data/social-media-image-sizes.json) · [English](README.md)

大多数尺寸表只写宽和高。可真正裁图的时候，还得知道 App 会在图上盖住哪里：YouTube 横幅上的头像、快拍底部的文案栏，以及 Instagram 主页的 3:4 网格会把 4:5 的帖子切掉一部分。这个数据集把这些区域都标成了像素坐标。

## 速览

每个分组只列一个尺寸，完整数据里还有更多。

| 平台 | 图片 | 尺寸（px） | 比例 | 在 CropDen 上裁剪 |
| --- | --- | --- | --- | --- |
| Instagram | 3:4 竖版帖子（另有 3 个） | 1080 × 1440 | 3:4 | [裁剪](https://cropden.com/zh/resize/instagram-post) |
| Instagram | 快拍（另有 2 个） | 1080 × 1920 | 9:16 | [裁剪](https://cropden.com/zh/resize/instagram-story) |
| Instagram | 头像（另有 1 个） | 320 × 320 | 1:1 | [裁剪](https://cropden.com/zh/resize/instagram-profile) |
| YouTube | 频道横幅（另有 1 个） | 2560 × 1440 | 16:9 | [裁剪](https://cropden.com/zh/resize/youtube-banner) |
| YouTube | 视频缩略图（4K）（另有 2 个） | 3840 × 2160 | 16:9 | [裁剪](https://cropden.com/zh/resize/youtube-thumbnail) |
| YouTube | Shorts（9:16）（另有 1 个） | 1080 × 1920 | 9:16 | [裁剪](https://cropden.com/zh/resize/youtube-shorts) |
| Facebook | 封面照片（另有 2 个） | 851 × 315 | 2.70:1 | [裁剪](https://cropden.com/zh/resize/facebook-cover) |
| Facebook | 动态帖子（4:5）（另有 3 个） | 1080 × 1350 | 4:5 | [裁剪](https://cropden.com/zh/social-media-image-sizes#facebook) |
| Discord | 个人资料横幅（另有 3 个） | 600 × 240 | 5:2 | [裁剪](https://cropden.com/zh/resize/discord-banner) |
| Discord | 自定义表情（另有 2 个） | 128 × 128 | 1:1 | [裁剪](https://cropden.com/zh/resize/discord-emoji) |
| LinkedIn | 个人主页背景图（另有 3 个） | 1584 × 396 | 4:1 | [裁剪](https://cropden.com/zh/resize/linkedin-banner) |
| X (Twitter) | 头图（另有 3 个） | 1500 × 500 | 3:1 | [裁剪](https://cropden.com/zh/resize/twitter-header) |
| Twitch | 个人主页横幅（另有 3 个） | 1200 × 480 | 5:2 | [裁剪](https://cropden.com/zh/resize/twitch-banner) |
| TikTok | 视频 / 图文（另有 2 个） | 1080 × 1920 | 9:16 | [裁剪](https://cropden.com/zh/resize/tiktok-video) |
| Pinterest | 标准 Pin（2:3）（另有 2 个） | 1000 × 1500 | 2:3 | [裁剪](https://cropden.com/zh/social-media-image-sizes#pinterest) |
| Snapchat | 快拍 / Spotlight | 1080 × 1920 | 9:16 | [裁剪](https://cropden.com/zh/social-media-image-sizes#snapchat) |
| Etsy | 商品图（4:3）（另有 2 个） | 3000 × 2250 | 4:3 | [裁剪](https://cropden.com/zh/social-media-image-sizes#etsy) |
| Shopify | 商品图 | 2048 × 2048 | 1:1 | [裁剪](https://cropden.com/zh/social-media-image-sizes#shopify) |
| eBay | 商品图 | 1600 × 1600 | 1:1 | [裁剪](https://cropden.com/zh/social-media-image-sizes#ebay) |
| Amazon | 商品主图 | 2000 × 2000 | 1:1 | [裁剪](https://cropden.com/zh/social-media-image-sizes#amazon) |

证件照（[在 CropDen 上制作](https://cropden.com/zh/resize/passport-photo)）：

| 证件 | 像素 | 打印尺寸 |
| --- | --- | --- |
| 美国护照 / 签证 | 600 × 600 | 50.8 × 50.8 mm |
| 英国护照 | 600 × 771 | 35 × 45 mm |
| 欧盟 / 申根 | 600 × 771 | 35 × 45 mm |
| 加拿大 | 600 × 840 | 50 × 70 mm |
| 澳大利亚 | 600 × 771 | 35 × 45 mm |
| 中国签证 | 600 × 873 | 33 × 48 mm |

全部尺寸和区域都在 [`data/social-media-image-sizes.json`](data/social-media-image-sizes.json) 里。想在浏览器里直接裁成这些尺寸，点最后一列的链接。

## 怎么用

```sh
npm install social-media-image-sizes
```

```js
import { getSize } from 'social-media-image-sizes';

getSize('instagram-post/portrait-34');
// { width: 1080, height: 1440, ratio: '3:4', exact: true, ... }
```

不装包也可以，直接请求：

```js
const res = await fetch('https://cropden.com/data/social-media-image-sizes.json');
const { groups, passportPhotos } = await res.json();
```

这个地址允许跨域请求，缓存 1 小时。

## 给 AI 用

### Skill：直接把图做成对的尺寸

[`skills/social-media-image-sizes`](skills/social-media-image-sizes/SKILL.md) 是一个 [Agent Skill](https://agentskills.io)，Claude Code、Codex、Cursor 这些会读 `SKILL.md` 的 AI 都能用。对它说"把这张照片做成 YouTube 横幅"或者"Instagram 快拍是多大"，它会选好尺寸，在你自己电脑上用 sharp 裁图，把文件压到平台上传上限以内，再生成一张预览图，用红色标出会被 App 盖住的区域。

```sh
npx skills add geektao1024/social-media-image-sizes
```

也可以直接把这个文件夹复制到 `~/.claude/skills/`（Claude Code），或者你用的 AI 的 skills 目录。

### MCP 服务：查尺寸，加 AI 修图

CropDen 提供远程 MCP 服务：`https://cropden.com/mcp`（Streamable HTTP）。

| 工具 | 做什么 | 费用 |
| --- | --- | --- |
| `get_image_sizes` | 查这份数据里的尺寸、安全区和上传上限 | 免费，不用密钥 |
| `ai_extend_image` | AI 扩图，把图扩成更宽或更高的比例 | 5 积分 |
| `ai_upscale_image` | AI 放大 2 倍或 4 倍 | 8 或 12 积分 |
| `ai_remove_background` | 一键抠图，输出透明 PNG | 1 积分 |
| `get_ai_task`、`get_credit_balance` | 查耗时较长的任务、查余额 | 免费，要密钥 |

Claude Code 里这样加：

```sh
claude mcp add --transport http cropden https://cropden.com/mcp \
  --header "Authorization: Bearer 你的 CropDen API 密钥"
```

其他客户端：把 `https://cropden.com/mcp` 加成 Streamable HTTP 服务，带上同样的请求头。密钥在 [cropden.com](https://cropden.com) 的"设置 → API 密钥"里创建。AI 工具和网站共用积分，失败会自动退回。不带密钥时只能用 `get_image_sizes`。

## 字段说明

- `width`、`height`：要导出的像素尺寸；`exact` 为 `false` 时只需要比例对。
- `recommended`：一个分组有多个尺寸时，我们推荐用的那个。
- `minWidth`、`minHeight`：平台能接受或需要的最小尺寸。
- `maxBytes`：上传大小上限，单位是字节（1 MB 按 1,000,000 字节算）。
- `zones`：用像素标出的区域。`safe-area` 是重要内容要放在里面的区域；`ui-overlay` 是会被 App 界面盖住的区域；`crop-preview` 是在别的位置（比如主页网格）显示时只露出的部分。
- 区域坐标从图片左上角算起，单位是像素。区域可以超出图片边缘，比如压在横幅底边上的头像。
- `measured: true`：这个区域是我们在 App 里实测的，平台没有公布。
- `verified`：这一组最后核对的月份。下个版本（0.2.0）会给每一组都附上来源链接。

发现哪个尺寸过时了，欢迎开 issue，附上来源链接就行。

## 许可

- 数据（`data/` 目录，以及 `index.js`、`index.cjs` 里的同一份数据）：[CC BY 4.0](LICENSE-DATA.md)。使用时请注明出处，比如写一句 `Image size data by CropDen (https://cropden.com), CC BY 4.0`；放在网站上的话，带上这个链接就够了。
- 代码：[MIT](LICENSE)。

## 致谢

决定收录哪些平台和证件照时，我们参考了 [SammaPix](https://github.com/samma1997/sammapix)（MIT），尺寸也拿它的数据文件做过对照。

如果它帮你省了一次查找，点个 star，能让更多人找到它。

作者在 X 上公开记录这个项目：[@geektao0319](https://x.com/geektao0319)。
