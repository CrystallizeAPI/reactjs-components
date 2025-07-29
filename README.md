# Crystallize React components

Typed React components for rendering Crystallize content: Image, Video, Grid, and Content Transformer.

## Installation

Use your favorite package manager:

```bash
# pnpm
pnpm add @crystallize/reactjs-components

# npm
npm install @crystallize/reactjs-components

# yarn
yarn add @crystallize/reactjs-components
```

All components are exported from the package root and ship with TypeScript types.

```typescript
import { Image, Video, GridRenderer, GridRenderingType, ContentTransformer } from '@crystallize/reactjs-components';
```

## Image

Responsive <img> wrapped in a <picture> with srcset support. Pass the image object you get from Crystallize.

```typescript
import { Image } from '@crystallize/reactjs-components';

const imageFromCrystallize = {
    url: 'https://media.crystallize.com/.../image.jpg',
    altText: 'A nice product',
    variants: [
        // ImageVariant[] from @crystallize/schema
        { url: '.../image@400.jpg', width: 400 },
        { url: '.../image@700.jpg', width: 700 },
        { url: '.../image@1000.webp', width: 1000 },
    ],
};

export function ProductImage() {
    return <Image {...imageFromCrystallize} sizes="(max-width: 600px) 90vw, 700px" className="product-image" />;
}
```

Notes

- If the API returns caption in json/html/plainText, the component renders it as <figcaption>.
- You can provide width/height to avoid layout shift; otherwise the largest variant's dimensions are used when available.

Live demo: https://crystallizeapi.github.io/libraries/reactjs-components/image

## Video

Progressive video player that prefers HLS (m3u8) and falls back to MPEG-DASH (mpd). Renders a thumbnail and a play button, then hydrates the player.

Important

- This component is client-side only (it contains 'use client'). In Next.js, place it in a client component.
- Include the provided styles once in your app:

```typescript
import '@crystallize/reactjs-components/assets/video/styles.css';
```

Usage

```typescript
import { Video } from '@crystallize/reactjs-components';

const videoFromCrystallize = {
    playlists: ['https://media.crystallize.com/.../master.m3u8', 'https://media.crystallize.com/.../stream.mpd'],
    thumbnails: [
        {
            url: 'https://media.crystallize.com/.../thumb.jpg',
            variants: [{ url: '.../thumb@700.jpg', width: 700 }],
        },
    ],
};

export function HeroVideo() {
    return (
        <Video
            {...videoFromCrystallize}
            autoPlay
            muted
            controls
            className="hero-video"
            videoProps={{ playsInline: true }}
        />
    );
}
```

Live demo: https://crystallizeapi.github.io/libraries/reactjs-components/video

## Grid

Render Crystallize grids in React using CSS Grid (default), a semantic table, or row/col wrappers.

Fetch the grid via GraphQL (minimum shape shown):

```graphql
query grid($id: Int!, $language: String!) {
    grid(id: $id, language: $language) {
        rows {
            columns {
                layout {
                    rowspan
                    colspan
                    colIndex
                    rowIndex
                }
                item {
                    name
                }
            }
        }
    }
}
```

Render

```typescript
import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components';

const Cell = ({ cell }: { cell: any }) => <div>{cell.item?.name}</div>;

<>
    {/* CSS Grid */}
    <GridRenderer grid={grid} type={GridRenderingType.Div} cellComponent={Cell} />

    {/* Table */}
    <GridRenderer grid={grid} type={GridRenderingType.Table} cellComponent={Cell} />

    {/* Row/Col wrappers */}
    <GridRenderer grid={grid} type={GridRenderingType.RowCol} cellComponent={Cell} />
</>;
```

Customize per cell via a render-prop or styleForCell

```tsx
<GridRenderer grid={grid} type={GridRenderingType.Div} cellComponent={Cell}>
    {({ cells }) =>
        cells.map((cell) => (
            <div
                key={`${cell.layout.rowIndex}-${cell.layout.colIndex}`}
                style={{ gridColumn: `span ${cell.layout.colspan}`, gridRow: `span ${cell.layout.rowspan}` }}
            >
                {cell.item.name}
            </div>
        ))
    }
</GridRenderer>
```

Live demo: https://crystallizeapi.github.io/libraries/reactjs-components/grid

## Content Transformer

Render Crystallize rich text JSON to React elements with optional per-node overrides.

```tsx
import { ContentTransformer, NodeContent, type Overrides, type NodeProps } from '@crystallize/reactjs-components';

const overrides: Overrides = {
    link: (props: NodeProps) => (
        <a href={props.metadata?.href} rel={props.metadata?.rel} target={props.metadata?.target}>
            <NodeContent {...props} />
        </a>
    ),
};

<ContentTransformer json={richTextJson} overrides={overrides} />;
```

Live demo: https://crystallizeapi.github.io/libraries/reactjs-components/content-transformer

## Notes on SSR

- Image, Grid, and Content Transformer are SSR-friendly.
- Video must run on the client. In Next.js, put the usage in a Client Component.

## License

MIT © Crystallize
