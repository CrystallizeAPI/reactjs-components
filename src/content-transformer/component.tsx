'use client';

import { Fragment, createContext, useContext } from 'react';
import { NodeProps, Overrides } from './types';
export { NodeProps, Overrides };

export const Renderers: Record<keyof Overrides, (props: NodeProps) => JSX.Element> = {
    link: (props) => (
        <a href={props.metadata?.href} rel={props.metadata?.rel} target={props.metadata?.target}>
            <NodeContent {...props} />
        </a>
    ),
    'unordered-list': (props) => (
        <ul>
            <NodeContent {...props} />
        </ul>
    ),
    'ordered-list': (props) => (
        <ol>
            <NodeContent {...props} />
        </ol>
    ),
    list: (props) => (
        <ul>
            <NodeContent {...props} />
        </ul>
    ),
    'list-item': (props) => (
        <li>
            <NodeContent {...props} />
        </li>
    ),
    quote: (props) => {
        if (props.kind === 'block') {
            return (
                <blockquote>
                    <NodeContent {...props} />
                </blockquote>
            );
        }
        return (
            <q>
                <NodeContent {...props} />
            </q>
        );
    },
    paragraph: (props) => (
        <p>
            <NodeContent {...props} />
        </p>
    ),
    preformatted: (props) => (
        <pre>
            <NodeContent {...props} />
        </pre>
    ),
    code: (props) => (
        <code>
            <NodeContent {...props} />
        </code>
    ),
    underlined: (props) => (
        <u>
            <NodeContent {...props} />
        </u>
    ),
    strong: (props) => (
        <strong>
            <NodeContent {...props} />
        </strong>
    ),
    emphasized: (props) => (
        <em>
            <NodeContent {...props} />
        </em>
    ),
    div: (props) => (
        <div>
            <NodeContent {...props} />
        </div>
    ),
    span: (props) => <NodeContent {...props} />,
    'line-break': () => <br />,
    heading1: (props) => (
        <h1>
            <NodeContent {...props} />
        </h1>
    ),
    heading2: (props) => (
        <h2>
            <NodeContent {...props} />
        </h2>
    ),
    heading3: (props) => (
        <h3>
            <NodeContent {...props} />
        </h3>
    ),
    deleted: (props) => (
        <del>
            <NodeContent {...props} />
        </del>
    ),
    subscripted: (props) => (
        <sub>
            <NodeContent {...props} />
        </sub>
    ),
    superscripted: (props) => (
        <sup>
            <NodeContent {...props} />
        </sup>
    ),
    'horizontal-line': () => <hr />,
    table: (props) => (
        <table>
            <NodeContent {...props} />
        </table>
    ),
    'table-row': (props) => (
        <tr>
            <NodeContent {...props} />
        </tr>
    ),
    'table-cell': (props) => (
        <td>
            <NodeContent {...props} />
        </td>
    ),
    'table-head-cell': (props) => (
        <th>
            <NodeContent {...props} />
        </th>
    ),
};

export interface Props {
    overrides?: Overrides | null;
    json?: NodeProps[] | NodeProps;
}

export const OverridesContext = createContext<Overrides | null>(null);

export const NodeContent = (props: NodeProps) => {
    const { textContent } = props;

    if (textContent) {
        return renderTextContent(textContent);
    }

    if (props.children) {
        return (
            <>
                {props.children.map((child, i) => (
                    <ContentTransformerNode key={i} {...child} />
                ))}
            </>
        );
    }

    return null;
};

// Render text and convert line breaks (\n) to <br />
export function renderTextContent(text: String) {
    const partsBetweenLineBreaks = text.split(/\n/g);
    if (partsBetweenLineBreaks.length === 1) {
        return <>{text}</>;
    }
    return (
        <>
            {partsBetweenLineBreaks.map((part: String, index: Number) => {
                const key = index.toString();
                if (index === partsBetweenLineBreaks.length - 1) {
                    return <Fragment key={key}>part</Fragment>;
                }
                return (
                    <Fragment key={key}>
                        {part}
                        <br />
                    </Fragment>
                );
            })}
        </>
    );
}

export const ContentTransformerNode = (props: NodeProps): JSX.Element => {
    let Renderer = Renderers.span;
    const overrides = useContext(OverridesContext);

    const { type, kind, textContent } = props;

    if (type) {
        const tag = type as keyof typeof Renderers;
        const override = overrides?.[tag] as () => JSX.Element;

        Renderer = override || Renderers[tag];
    }

    if (!Renderer) {
        Renderer = Renderers.span;

        if (type === 'container' && kind === 'block') {
            Renderer = Renderers.div;
        } else if (type === null && textContent) {
            return renderTextContent(textContent);
        }
    }

    return <Renderer {...props} />;
};

export const ContentTransformer = ({ overrides = null, json }: Props) => {
    if (!json) {
        return null;
    }

    if (Array.isArray(json)) {
        const nodes: NodeProps[] = json;
        return (
            <OverridesContext.Provider value={overrides}>
                {nodes.map((j, i) => (
                    <ContentTransformerNode key={i} {...j} />
                ))}
            </OverridesContext.Provider>
        );
    }

    const node: NodeProps = json;

    return (
        <OverridesContext.Provider value={overrides}>
            <ContentTransformerNode {...node} />
        </OverridesContext.Provider>
    );
};
