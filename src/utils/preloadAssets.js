export async function preloadImages(images, onProgress) {

  if (!images || images.length === 0) {

    onProgress(100);

    return;

  }

  let loaded = 0;

  const total = images.length;

  const promises = images.map((src) => {

    return new Promise((resolve) => {

      const img = new Image();

      img.onload = () => {

        loaded++;

        onProgress(
          Math.round((loaded / total) * 100)
        );

        resolve();

      };

      img.onerror = () => {

        loaded++;

        onProgress(
          Math.round((loaded / total) * 100)
        );

        resolve();

      };

      img.src = src;

    });

  });

  await Promise.all(promises);

  onProgress(100);

}