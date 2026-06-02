// export const sequenceCache = {};
// export const dayNightCache = {};
export const panoramaCache = {};
// export const AmenitiesCaches = {};


// utils/imageCache.js
export const sequenceCache = new Array(72).fill(null);
export const dayNightCache = {}; // Assuming ~60 frames for day/night transition
// Unified store for heavy sub-viewers

// Must match the exact naming import mapping used in your components
export const AmenitiesCaches = new Array(7).fill(null);

export const globalAppCache = {
  location: {
    baseMap: null, // Holds the pre-decoded layout background image element
  },
  highlights: {
    videoBlobUrl: null, // Holds the raw video binary memory buffer bridge URL
    isReady: false,
  }
};