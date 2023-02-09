import React, { FunctionComponent } from 'react';
import { ImageVariant, RichTextContent } from '@crystallize/js-api-client';

export interface ImageProps {
    children?: FunctionComponent<any>;
    src?: string;
    url?: string;
    sizes?: string;
    altText?: string;
    alt?: string;
    fallbackAlt?: string;
    media?: string;
    style?: React.CSSProperties;
    className?: string;
    width?: number;
    height?: number;
    // The `html` content has higher priority than `plainText` because it has richer content.
    // In case of getting both, the `html` is the one that will be displayed.
    caption?: RichTextContent;
    captionPassed?: string;
    fallbackCaption?: string;
    variants?: ImageVariant[];
    loading?: 'eager' | 'lazy';
    _availableSizes?: number[];
    _availableFormats?: string[];
}
