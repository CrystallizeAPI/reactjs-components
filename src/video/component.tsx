'use client';

import { useState, useEffect, useRef, FC } from 'react';
import { ImageVariant } from '@crystallize/js-api-client';
import { supportsDash, getDash } from './dash';
import { getHls } from './hls';
import { VideoProps } from './types';
import { Image } from '../image/component';

declare global {
    interface navigator {
        connection: any;
    }
}

/**
 * Fallback function to get a video poster from the list of
 * variants
 */
function getPoster(thumbnails?: any[]): string | undefined {
    if (thumbnails && thumbnails.length > 0) {
        const [firstThumbnail] = thumbnails;

        // Check for naive image props
        if (firstThumbnail._availableSizes && firstThumbnail._availableFormats) {
            return firstThumbnail.url;
        }

        const allVariants = firstThumbnail.variants as ImageVariant[];

        const variantsNoFancyStuff = allVariants.filter((v) => !v.url.endsWith('.webp') && !v.url.endsWith('.avif'));

        return (
            variantsNoFancyStuff.filter((v) => v.width > 500).sort((a, b) => a.width - b.width)[0].url ||
            variantsNoFancyStuff[0].url
        );
    }
    return undefined;
}

export const Video: FC<VideoProps> = ({
    playlists,
    thumbnails,
    thumbnailProps,
    videoProps,
    autoPlay,
    loop = false,
    muted = false,
    controls = true,
    poster,
    playButtonText = 'Play video',
    className,
}) => {
    const [showThumbnail, setShowThumbnail] = useState(true);
    const [playVideo, setPlayVideo] = useState(false);
    const [initiated, setInitiated] = useState(false);
    const ref = useRef<HTMLVideoElement>(null);

    /**
     * Determine if we should auto play the video.
     * We allow for auto play unless the user has opted
     * in for saving data
     */
    useEffect(() => {
        if (autoPlay) {
            const connection = (navigator as any).connection;
            if (!connection || !connection.saveData) {
                setPlayVideo(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!playVideo) {
            return;
        }

        if (initiated) {
            return;
        }

        const video = ref.current;
        if (!video) {
            throw new Error('Cannot initialize video. Unable to find the video HTML node');
        }

        // Hide the thumbnail when the video has started
        video.addEventListener('playing', () => setShowThumbnail(false), {
            once: true,
        });

        const startWithHighQualityVideo = (function () {
            try {
                const connection = (navigator as any).connection;
                return connection.downlink >= 5 && !connection.saveData;
            } catch (e) {
                return false;
            }
        })();

        /**
         * Prioritise m3u8
         */
        const m3u8Src = playlists.find((p) => p.endsWith('.m3u8'));
        if (m3u8Src) {
            /**
             * iOS has native support for HLS, and we can use
             * the m3u8 source directly, without the use of hls.js
             */
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.autoplay = true;
                video.src = m3u8Src;

                setInitiated(true);
            } else {
                getHls().then((hls) => {
                    hls.loadSource(m3u8Src);
                    hls.attachMedia(video);

                    hls.on('hlsMediaAttached', function () {
                        video.muted = true;
                        video.play();
                    });

                    setInitiated(true);
                });
            }
        } else if (supportsDash()) {
            getDash().then((dashjs) => {
                const src = playlists.find((p) => p.endsWith('.mpd'));
                if (!src) {
                    throw new Error('Cannot find a valid Dash source for video');
                }

                const player = dashjs.MediaPlayer().create();

                player.initialize();

                player.updateSettings({
                    debug: {
                        logLevel: dashjs.Debug.LOG_LEVEL_NONE /* turns off console logging */,
                    },
                    streaming: {
                        abr: {
                            initialBitrate: {
                                audio: -1,
                                video: startWithHighQualityVideo ? 10000 : -1,
                            },
                            autoSwitchBitrate: { audio: true, video: true },
                        },
                    },
                });
                player.setAutoPlay(true);
                player.attachView(video);
                player.attachSource(src);

                setInitiated(true);
            });
        }
    }, [playVideo]);

    function onPlayClick(event: any) {
        event.preventDefault();
        setPlayVideo(true);
    }

    const thumbnailStyle = {
        zIndex: showThumbnail ? 2 : 1,
        opacity: showThumbnail ? 1 : 0,
    };

    const posterUrl = poster || getPoster(thumbnails);

    return (
        <div className={`react-video${className ? ` ${className}` : ''}`} style={{ position: 'relative' }}>
            {thumbnails && thumbnails.length > 0 ? (
                <Image
                    {...thumbnails[0]}
                    className="react-video__thumbnail"
                    {...thumbnailProps}
                    style={thumbnailStyle}
                />
            ) : (
                <div className="react-video__thumbnail-placeholder" style={thumbnailStyle} />
            )}
            {!playVideo && (
                <button className="react-video__play-btn" onClick={onPlayClick}>
                    {playButtonText}
                    <svg viewBox="0 0 100 100" className="react-video__play-icon">
                        <path d="M78.158 51.843L25.842 82.048c-1.418.819-3.191-.205-3.191-1.843v-60.41c0-1.638 1.773-2.661 3.191-1.843l52.317 30.205c1.418.819 1.418 2.867-.001 3.686z" />
                    </svg>
                </button>
            )}
            <video
                className="react-video__video"
                ref={ref}
                controls={controls}
                playsInline
                muted={muted}
                loop={loop}
                poster={posterUrl}
                style={{ opacity: initiated ? 1 : 0, zIndex: showThumbnail ? 1 : 2 }}
                {...videoProps}
            />
        </div>
    );
};
