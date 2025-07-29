'use client';

import { useState, useEffect, useRef, FC } from 'react';
import { ImageVariant } from '@crystallize/schema/catalogue';
import { supportsDash, getDash } from './dash.js';
import { getHls } from './hls.js';
import { VideoProps } from './types.js';
import { Image } from '../image/component.js';
import type { ImageProps } from '../image/types.js';

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
    if (!thumbnails || thumbnails.length === 0) {
        return undefined;
    }

    const [firstThumbnail] = thumbnails;

    // Check for naive image props
    if (
        firstThumbnail &&
        firstThumbnail._availableSizes &&
        firstThumbnail._availableFormats &&
        typeof firstThumbnail.url === 'string'
    ) {
        return firstThumbnail.url;
    }

    const allVariants: ImageVariant[] = Array.isArray(firstThumbnail?.variants)
        ? (firstThumbnail.variants as ImageVariant[]).filter(
              (v): v is ImageVariant => !!v && typeof (v as any).url === 'string',
          )
        : [];

    const variantsNoFancyStuff = allVariants.filter((v: ImageVariant) => {
        const url = v.url;
        return typeof url === 'string' && !url.endsWith('.webp') && !url.endsWith('.avif');
    });

    if (variantsNoFancyStuff.length === 0) {
        return undefined;
    }

    const biggerThan500 = variantsNoFancyStuff.filter((v: ImageVariant) => (v.width ?? 0) > 500);
    const sorted = biggerThan500.sort((a: ImageVariant, b: ImageVariant) => (a.width ?? 0) - (b.width ?? 0));
    const candidate = sorted[0] ?? variantsNoFancyStuff[0];

    return candidate?.url;
}

/**
 * Sanitize a thumbnail object into valid ImageProps, coercing nulls to undefined
 * and filtering invalid variants
 */
function sanitizeImageProps(thumbnail: any): Partial<ImageProps> {
    if (!thumbnail || typeof thumbnail !== 'object') return {};

    const width = typeof thumbnail.width === 'number' ? thumbnail.width : undefined;
    const height = typeof thumbnail.height === 'number' ? thumbnail.height : undefined;

    const url = typeof thumbnail.url === 'string' ? thumbnail.url : undefined;
    const src = typeof thumbnail.src === 'string' ? thumbnail.src : undefined;

    const variants = Array.isArray(thumbnail.variants) ? (thumbnail.variants as any[]).filter((v) => !!v) : undefined;

    const _availableSizes = Array.isArray(thumbnail._availableSizes)
        ? (thumbnail._availableSizes as any[]).filter((n) => typeof n === 'number')
        : undefined;
    const _availableFormats = Array.isArray(thumbnail._availableFormats)
        ? (thumbnail._availableFormats as any[]).filter((s) => typeof s === 'string')
        : undefined;

    const altText = typeof thumbnail.altText === 'string' ? thumbnail.altText : undefined;
    const className = typeof thumbnail.className === 'string' ? thumbnail.className : undefined;

    return {
        url,
        src,
        variants,
        _availableSizes,
        _availableFormats,
        width,
        height,
        altText,
        className,
    };
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
                    {...sanitizeImageProps(thumbnails[0])}
                    className="react-video__thumbnail"
                    {...(thumbnailProps as any)}
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
