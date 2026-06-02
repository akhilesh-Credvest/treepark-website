// utils/preloadAssets.js
export function preloadImages(urls, onProgress) {
  return new Promise((resolve, reject) => {
    if (!urls || urls.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    const totalCount = urls.length;

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      
      img.onload = () => {
        loadedCount++;
        if (onProgress) {
          onProgress((loadedCount / totalCount) * 100);
        }
        if (loadedCount === totalCount) {
          resolve();
        }
      };

      img.onerror = () => {
        // Count broken frames anyway so loading indicator never freezes up
        loadedCount++;
        if (onProgress) {
          onProgress((loadedCount / totalCount) * 100);
        }
        if (loadedCount === totalCount) {
          resolve();
        }
      };
    });
  });
}