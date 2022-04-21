import { HTMLAttributes, FunctionComponent } from 'react';
import { ImageVariant, RichTextContent } from '@crystallize/js-api-client';

export interface ImageProps extends HTMLAttributes<HTMLImageElement> {
    children?: FunctionComponent<any>;
    src?: string;
    url?: string;
    sizes?: string;
    altText?: string;
    alt?: string;
    media?: string;
    // The `html` content has higher priority than `plainText` because it has richer content.
    // In case of getting both, the `html` is the one that will be displayed.
    caption?: RichTextContent;
    variants?: ImageVariant[];
    loading?: 'eager' | 'lazy';
    _availableSizes?: number[];
    _availableFormats?: string[];
}
