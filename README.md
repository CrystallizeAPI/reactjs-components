# React JS Components

This brings Image, Grid and Content Transformer component to ease your rendering when using React JS.

## Installation

With NPM:

```bash
npm install @crystallize/reactjs-components
```

With Yarn:

```bash
yarn add @crystallize/reactjs-components
```

## Image

This output an `img` tag with different source variations from Crystallize using _srcset_. Use this to easily build responsive images powered by Crystallize.

```javascript
import { Image } from '@crystallize/reactjs-components/dist/image';
const imageFromCrystallize = {
    url: '...',
    variants: [...]
}

<Image
    {...imageFromCrystallize}
    sizes="(max-width: 400px) 300w, 700px"
/>
```

There is a live demo: https://crystallizeapi.github.io/libraries/reactjs-components/image

## Video

This output videos from Crystallize using the native video element.

```javascript
import { Video } from '@crystallize/reactjs-components/dist/video';
import '@crystallize/reactjs-components/assets/video/styles.css';
const videoFromCrystallize = {
    playlists: [...],
    thumbnails: [...]
}

<Video
    {...videoFromCrystallize}
    thumbnmailProps={{ sizes: "(max-width: 700px) 90vw, 700px" }}
/>
```

There is a live demo: https://crystallizeapi.github.io/libraries/reactjs-components/video

## Grid

That makes it easy to render Crystallize grids with React JS. In order to use the grid renderer you'll need to have fetched your grid model. This can be fetched fairly easily from Crystallize's API via GraphQL.

At the minimum you will need to fetch layout of each column and some properties on the item. Your query might look something like this:

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

Then, inside your component, render the Grid, passing through the grid model as a prop. By default, the grid is rendered using CSS grid but it could also be a Table.

```javascript
<GridRenderer grid={grid} type={GridRenderingType.Div} cellComponent={Cell} />
<GridRenderer grid={grid} type={GridRenderingType.Table} cellComponent={Cell} />
<GridRenderer grid={grid} type={GridRenderingType.RowCol} cellComponent={Cell} />
```

There is a live demo: https://crystallizeapi.github.io/libraries/reactjs-components/grid

### To go further

If you want full control over each of the cells, you can instead supply a function as the children of the grid component. This will allow you to iterate over each of the cells and mutate them as you please.

```javascript
const children = ({ cells }) => {
    return cells.map((cell) => (
        <div
            style={{
                gridColumn: `span ${cell.layout.colspan}`,
                gridRow: `span ${cell.layout.rowspan}`,
            }}
        >
            {cell.item.name}
        </div>
    ));
};

return (
    <GridRenderer grid={grid} type={GridRenderingType.Div} cellComponent={Cell}>
        {children}
    </GridRenderer>
);
```

## Content Transformer

This helps you to transform Crystallize rich text json to React html components.

```javascript
const overrides: Overrides = {
    link: (props: NodeProps) => (
        <a href={props.metadata?.href}>
            <NodeContent {...props} />
        </a>
    ),
};

<ContentTransformer json={richTextJson} overrides={overrides} />;
```

There is a live demo: https://crystallizeapi.github.io/libraries/reactjs-components/content-transformer

[crystallizeobject]: crystallize_marketing|folder|6269c9819161f671155d939d
