import { ImageVariant } from '@crystallize/js-api-client';
import { HTMLAttributes } from 'react';

export interface VideoProps extends HTMLAttributes<HTMLDivElement> {
    playlists: string[];
    thumbnails?: ImageVariant[];
    thumbnailProps?: object;
    videoProps?: HTMLAttributes<HTMLVideoElement>;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    poster?: string;
    playButtonText?: string;
}
