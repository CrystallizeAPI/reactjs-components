declare global {
    interface Window {
        dashjs: any;
    }
}

function supportsMediaSource() {
    let hasWebKit = 'WebKitMediaSource' in window;
    let hasMediaSource = 'MediaSource' in window;

    return hasWebKit || hasMediaSource;
}

export const supportsDash = supportsMediaSource;

let added = false;

export function getDash() {
    return new Promise<any>((resolve) => {
        if (!added) {
            const hlsCore = document.createElement('script');
            hlsCore.src = 'https://cdn.dashjs.org/latest/dash.all.min.js';
            hlsCore.defer = true;
            document.head.appendChild(hlsCore);

            added = true;
        }

        (function checkForLibraryExistence() {
            if ('dashjs' in window) {
                resolve(window.dashjs);
            } else {
                setTimeout(checkForLibraryExistence, 10);
            }
        })();
    });
}
