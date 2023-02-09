import { ImageVariant } from '@crystallize/js-api-client';
import { FunctionComponent } from 'react';
import { ContentTransformer } from '../content-transformer';
import { ImageProps } from './types';

function getVariantSrc(variant: ImageVariant): string {
    return `${variant.url} ${variant.width}w`;
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
            if (!acc.width || v.width > acc.width) {
                return v;
            }
            return acc;
        }, vars[0]);
    }

    // Determine srcSet
    const std = vars.filter((v) => v.url && !v.url.endsWith('.webp') && !v.url.endsWith('.avif'));
    const webp = vars.filter((v) => v.url && v.url.endsWith('.webp'));
    const avif = vars.filter((v) => v.url && v.url.endsWith('.avif'));
    const srcSet = std.map(getVariantSrc).join(', ');
    const srcSetWebp = webp.map(getVariantSrc).join(', ');
    const srcSetAvif = avif.map(getVariantSrc).join(', ');

    // Determine the original file extension
    let originalFileExtension = 'jpeg';
    if (std.length > 0) {
        const match = std[0].url.match(/\.(?<name>[^.]+)$/);
        originalFileExtension = match?.groups?.name || 'jpeg';

        // Provide correct mime type for jpg
        if (originalFileExtension === 'jpg') {
            originalFileExtension = 'jpeg';
        }
    }

    const commonProps = {
        // Ensure fallback src for older browsers
        src: src || url || (hasVariants ? std[0].url : undefined),
        alt,
        width: width ?? biggestImage?.width,
        height: height ?? biggestImage?.height,
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
                    <ContentTransformer json={caption.json} />
                </figcaption>
            ) : (
                <figcaption>{captionString}</figcaption>
            )}
        </figure>
    );
};
