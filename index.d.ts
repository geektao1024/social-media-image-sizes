/** Text in English and Chinese. */
export type L10n = { en: string; zh: string };

export type Zone = {
  label: L10n;
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * - `safe-area`: keep key content inside.
   * - `ui-overlay`: covered by the app's buttons, captions or profile picture.
   * - `crop-preview`: what another surface (e.g. the profile grid) shows.
   */
  type: 'safe-area' | 'ui-overlay' | 'crop-preview';
  shape?: 'circle';
  /** Measured in the live apps; the platform doesn't publish it. */
  measured?: true;
};

export type Size = {
  /** `<group>/<size>`, e.g. `instagram-post/portrait-34`. */
  id: string;
  name: L10n;
  width: number;
  height: number;
  /** e.g. `3:4`, or `2.70:1` when the reduced ratio would be unreadable. */
  ratio: string;
  /** False: only the aspect ratio matters. */
  exact: boolean;
  /** The size we'd pick for this group. */
  recommended?: true;
  minWidth?: number;
  minHeight?: number;
  /** Upload limit in bytes (1 MB = 1,000,000 bytes). */
  maxBytes?: number;
  /** Displayed as a circle. */
  circle?: true;
  zones?: Zone[];
  note?: L10n;
};

export type Group = {
  /** e.g. `instagram-post`, `youtube-banner`, `pinterest`. */
  id: string;
  platform: string;
  name?: L10n;
  /** Accepted file formats. */
  formats: string[];
  facts?: { label: L10n; value: L10n }[];
  /** Month the numbers were last checked, `YYYY-MM`. */
  verified: string;
  /** Crop or resize to these sizes on CropDen. */
  url: string;
  sizes: Size[];
};

export type PassportPhoto = {
  /** Country or document, e.g. `us`, `schengen`, `china-visa`. */
  id: string;
  name: L10n;
  /** Pixel size for online use. */
  width: number;
  height: number;
  printWidthMm: number;
  printHeightMm: number;
  /** Chin-to-crown height as a fraction of the photo height. */
  headMin: number;
  headMax: number;
  /** Eye line as a fraction of the photo height, from the bottom edge. */
  eyeMin?: number;
  eyeMax?: number;
  minWidth?: number;
  minHeight?: number;
  maxBytes?: number;
  note?: L10n;
};

export type Dataset = {
  name: string;
  version: string;
  license: 'CC-BY-4.0';
  attribution: string;
  source: string;
  groups: Group[];
  passportPhotos: {
    verified: string;
    url: string;
    facts?: { label: L10n; value: L10n }[];
    photos: PassportPhoto[];
  };
};

declare const data: Dataset;
export default data;

export declare const groups: Group[];
/** Every size in one list, with its group id and platform. */
export declare const sizes: (Size & { group: string; platform: string })[];
export declare const passportPhotos: PassportPhoto[];

export declare function getGroup(id: string): Group | undefined;
/** `getSize('instagram-post/portrait-34')` */
export declare function getSize(
  id: string
): (Size & { group: string; platform: string }) | undefined;
