'use client';

import { Fragment, createContext, useContext, HTMLAttributes } from 'react';
import { NodeProps, Overrides } from './types';
export { NodeProps, Overrides };

export const Renderers = {
    link: (props: NodeProps) => (
        <a href={props.metadata?.href}>
            <NodeContent {...props} />
        </a>
    ),
    'unordered-list': (props: NodeProps) => (
        <ul>
            <NodeContent {...props} />
        </ul>
    ),
    'ordered-list': (props: NodeProps) => (
        <ol>
            <NodeContent {...props} />
        </ol>
    ),
    list: (props: NodeProps) => (
        <ul>
            <NodeContent {...props} />
        </ul>
    ),
    'list-item': (props: NodeProps) => (
        <li>
            <NodeContent {...props} />
        </li>
    ),
    quote: (props: NodeProps) => {
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
    paragraph: (props: NodeProps) => (
        <p>
            <NodeContent {...props} />
        </p>
    ),
    preformatted: (props: NodeProps) => (
        <pre>
            <NodeContent {...props} />
        </pre>
    ),
    code: (props: NodeProps) => (
        <code>
            <NodeContent {...props} />
        </code>
    ),
    underlined: (props: NodeProps) => (
        <u>
            <NodeContent {...props} />
        </u>
    ),
    strong: (props: NodeProps) => (
        <strong>
            <NodeContent {...props} />
        </strong>
    ),
    emphasized: (props: NodeProps) => (
        <em>
            <NodeContent {...props} />
        </em>
    ),
    div: (props: NodeProps) => (
        <div>
            <NodeContent {...props} />
        </div>
    ),
    span: (props: NodeProps) => <NodeContent {...props} />,
    'line-break': () => <br />,
};

export interface Props extends HTMLAttributes<HTMLDivElement> {
    overrides?: Overrides | null;
    json?: [NodeProps] | NodeProps;
}

export const OverridesContext = createContext<Overrides | null>(null);

export const NodeContent = (props: NodeProps) => {
    const { textContent } = props;

    if (textContent) {
        return renderTextContent(textContent);
    }

    if (props.children) {
        return (
            <Fragment>
                {props.children.map((child, i) => (
                    <ContentTransformerNode key={i} {...child} />
                ))}
            </Fragment>
        );
    }

    return null;
};

// Render text and convert line breaks (\n) to <br />
export function renderTextContent(text: String) {
    const partsBetweenLineBreaks = text.split(/\n/g);
    if (partsBetweenLineBreaks.length === 1) {
        return <Fragment>{text}</Fragment>;
    }
    return (
        <Fragment>
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
        </Fragment>
    );
}

export const ContentTransformerNode = (props: NodeProps): JSX.Element => {
    let Renderer = Renderers.span;
    const overrides = useContext(OverridesContext);

    const { type, kind, textContent } = props;

    if (type) {
        const t = type as keyof typeof Renderers;
        const override = overrides?.[t] as () => JSX.Element;

        Renderer = override || Renderers[type as keyof typeof Renderers];
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
        const nodes: [NodeProps] = json;
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
