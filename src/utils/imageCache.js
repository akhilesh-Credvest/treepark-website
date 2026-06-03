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
    baseMap: null,       // Map for LocationViewer (/location/Location_result.webp)
  },
  masterplan: {
    baseMap: null,       // Map for AmenitiesViewer (/masterplan/HighresScreenshot00060_result.webp)
  },
  panoramas: {
    tourBase: null,      // Static panoramic entry frame (/panoramas/1_result.webp)
  },
  highlights: {
    videoBlobUrl: null,
    isReady: false,
  }
};