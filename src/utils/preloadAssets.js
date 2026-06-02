export async function preloadImages(
  assets,
  onProgress = () => {}
) {

  let loaded = 0;

  const total = assets.length;

  const promises = assets.map((src) => {

    return new Promise((resolve) => {

      const extension =
        src.split(".").pop();

      // VIDEO

      if (
        extension === "mp4"
      ) {

        const video =
          document.createElement("video");

        video.preload = "auto";

        video.onloadeddata = () => {

          loaded++;

          onProgress(
            (loaded / total) * 100
          );

          resolve();

        };

        video.onerror = () => {

          loaded++;

          onProgress(
            (loaded / total) * 100
          );

          resolve();

        };

        video.src = src;

        return;

      }

      // IMAGE

      const img = new Image();

      img.onload = () => {

        loaded++;

        onProgress(
          (loaded / total) * 100
        );

        resolve();

      };

      img.onerror = () => {

        loaded++;

        onProgress(
          (loaded / total) * 100
        );

        resolve();

      };

      img.src = src;

    });

  });

  await Promise.all(promises);

}