declare global {
    interface Window {
        Hls: any;
    }
}

let added = false;

export function getHls() {
    return new Promise<any>((resolve) => {
        if (!added) {
            const hlsCore = document.createElement('script');
            hlsCore.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            hlsCore.defer = true;
            document.head.appendChild(hlsCore);

            added = true;
        }

        (function checkForLibraryExistence() {
            if ('Hls' in window) {
                resolve(
                    new window.Hls({
                        testBandwidth: false,
                        abrEwmaDefaultEstimate: 1000000,
                        abrMaxWithRealBitrate: true,
                    }),
                );
            } else {
                setTimeout(checkForLibraryExistence, 10);
            }
        })();
    });
}
