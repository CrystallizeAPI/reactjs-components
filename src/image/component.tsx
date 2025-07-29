import { ImageVariant } from '@crystallize/schema/catalogue';
import { FunctionComponent } from 'react';
import { ContentTransformer } from '../content-transformer/index.js';
import { ImageProps } from './types.js';

function getVariantSrc(variant: ImageVariant): string {
    if (!variant.url) return '';
    return variant.width ? `${variant.url} ${variant.width}w` : `${variant.url}`;
}

export const Image: FunctionComponent<ImageProps> = ({ children, ...restOfAllProps }) => {
    const {
        src,
        url,
        sizes,
        variants,
        altText,
        alt: altPassed,
        fallbackAlt,
        caption,
        captionPassed,
        fallbackCaption,
        className,
        media,
        _availableSizes,
        _availableFormats,
        width,
        height,
        ...rest
    } = restOfAllProps;

    let vars = (variants || []).filter((v) => !!v);

    // if the alt is passed to the component we use that: highest priority
    // if there is nothing from the API response (altText) then we use the fallbackAlt
    // otherwise we set empty for W3C validation
    const alt = altPassed || altText || fallbackAlt || '';

    //if the caption is passed to the component we use that: highest priority
    // if there is nothing from the API response (caption) then we use the fallbackCaption
    // otherwise we set empty for W3C validation

    let captionString = captionPassed || caption?.html || caption?.plainText || fallbackCaption || '';

    // Naive rendering POC
    if (url && _availableSizes && _availableFormats) {
        vars = [];
        const urlWithoutFileExtension = url.replace(/\.[^/]+$/, '');
        const match = urlWithoutFileExtension.match(/(.+)(\/)([^/]+)$/);
        if (match) {
            const [, base, , filename] = match;

            _availableSizes.forEach((size) => {
                _availableFormats.forEach((format) => {
                    vars.push({
                        url: `${base}/@${size}/${filename}.${format}`,
                        key: `${size}.${format}`,
                        width: size,
                    });
                });
            });
        }
    }

    const hasVariants = vars.length > 0;

    // Get the biggest image from the variants
    let biggestImage: ImageVariant = vars[0];
    if (hasVariants) {
        biggestImage = vars.reduce(function (acc: ImageVariant, v: ImageVariant): ImageVariant {
            const aw = acc.width ?? 0;
            const vw = v.width ?? 0;
            return vw > aw ? v : acc;
        }, vars[0]);
    }

    // Determine srcSet
    const std = vars.filter((v) => v.url && !v.url.endsWith('.webp') && !v.url.endsWith('.avif'));
    const webp = vars.filter((v) => v.url && v.url.endsWith('.webp'));
    const avif = vars.filter((v) => v.url && v.url.endsWith('.avif'));
    // Prefer candidates that have both url and width for srcset quality
    const srcSet = std.map(getVariantSrc).filter(Boolean).join(', ');
    const srcSetWebp = webp.map(getVariantSrc).filter(Boolean).join(', ');
    const srcSetAvif = avif.map(getVariantSrc).filter(Boolean).join(', ');

    // Determine the original file extension used for the "standard" set
    let originalFileExtension = 'jpeg';
    if (std.length > 0 && std[0]?.url) {
        const match = std[0].url.match(/\.(?<name>[^.]+)$/);
        let ext = match?.groups?.name?.toLowerCase();
        if (ext === 'jpg') ext = 'jpeg';
        if (ext) originalFileExtension = ext;
    }

    // Safe fallback src: prefer explicit src, then original url, then any variant
    const fallbackSrc = src ?? url ?? std[0]?.url ?? webp[0]?.url ?? avif[0]?.url ?? undefined;

    const computedWidth = width ?? biggestImage?.width;
    const computedHeight = height ?? biggestImage?.height ?? undefined;

    const commonProps = {
        // Ensure fallback src for older browsers and when no <source> matches
        src: fallbackSrc,
        alt,
        width: computedWidth,
        height: computedHeight,
    };

    let useWebP = srcSetWebp.length > 0;
    let useAvif = srcSetAvif.length > 0;

    /**
     * Only output Avif format if it is smaller than
     * webP. For the future: show only one of them when
     * the browser support for Avif is good enough
     */
    if (useWebP && useAvif) {
        const [firstWebp] = webp;
        const [firstAvif] = avif;
        if (firstWebp.size && firstAvif.size) {
            useAvif = firstWebp.size > firstAvif.size;
        }
    }

    if (children) {
        return children({
            srcSet,
            srcSetWebp,
            srcSetAvif,
            useAvif,
            useWebP,
            className,
            sizes,
            media,
            ...commonProps,
            ...rest,
            originalFileExtension,
        });
    }

    return (
        <figure className={className}>
            <picture>
                {useAvif && <source srcSet={srcSetAvif} type="image/avif" sizes={sizes} media={media} />}
                {useWebP && <source srcSet={srcSetWebp} type="image/webp" sizes={sizes} media={media} />}
                {srcSet.length > 0 && (
                    <source srcSet={srcSet} type={`image/${originalFileExtension}`} sizes={sizes} media={media} />
                )}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img {...commonProps} {...rest} />
            </picture>

            {!captionPassed && caption?.json ? (
                <figcaption>
                    {/* The schema exposes json as unknown[], cast to the transformer node type */}
                    <ContentTransformer json={caption.json as any} />
                </figcaption>
            ) : (
                <figcaption>{captionString}</figcaption>
            )}
        </figure>
    );
};
