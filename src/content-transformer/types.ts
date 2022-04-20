import { ReactElement } from 'react';

interface NodeMetadata {
    [key: string]: any;
}

export interface NodeProps {
    kind?: string;
    type?: string;
    textContent?: string;
    children?: [NodeProps];
    metadata?: NodeMetadata;
}

export type Override = (props: NodeProps) => ReactElement<any, any> | null | string;

export interface Overrides {
    link?: Override;
    'unordered-list'?: Override;
    'ordered-list'?: Override;
    list?: Override;
    'list-item'?: Override;
    quote?: Override;
    paragraph?: Override;
    preformatted?: Override;
    code?: Override;
    underlined?: Override;
    strong?: Override;
    emphasized?: Override;
    div?: Override;
    span?: Override;
    'line-break'?: Override;
}
