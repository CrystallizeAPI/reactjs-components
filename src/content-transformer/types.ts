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

export type Override = (props: NodeProps) => JSX.Element;

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
    heading1?: Override;
    heading2?: Override;
    heading3?: Override;
    deleted?: Override;
    subscripted?: Override;
    superscripted?: Override;
    'horizontal-line'?: Override;
    table?: Override;
    'table-row'?: Override;
    'table-cell'?: Override;
    'table-head-cell'?: Override;
}
