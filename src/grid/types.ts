import React, { FunctionComponent } from 'react';

export enum GridRenderingType {
    Table = 'table',
    Div = 'div',
    RowCol = 'row-col',
}

export type GridPositionnable = {
    rowIndex: number;
    colIndex: number;
    rowLength: number;
    colLength: number;
};
export interface CSSGridProps {
    cellComponent: React.FunctionComponent<{ cell: any; totalColSpan: number }>;
    cells: any;
    children?: FunctionComponent<any>;
    totalColSpan: number;
    style?: React.CSSProperties;
    styleForCell?: (cell: any, positionInfos: GridPositionnable, styles: React.CSSProperties) => React.CSSProperties;
}

export interface TableGridProps {
    cellComponent: React.FunctionComponent<{ cell: any; totalColSpan: number }>;
    rows: any;
    children?: FunctionComponent<any>;
    totalColSpan: number;
    style?: React.CSSProperties;
    styleForCell?: (cell: any, positionInfos: GridPositionnable, styles: React.CSSProperties) => React.CSSProperties;
}

export interface RowColGridProps {
    cellComponent: React.FunctionComponent<{ cell: any; totalColSpan: number }>;
    rows: any;
    children?: FunctionComponent<any>;
    totalColSpan: number;
    style?: React.CSSProperties;
    styleForCell?: (cell: any, positionInfos: GridPositionnable, styles: React.CSSProperties) => React.CSSProperties;
}
export interface GridRendererProps {
    cellComponent: React.FunctionComponent<{ cell: any; totalColSpan: number }>;
    type: GridRenderingType;
    grid: {
        rows: any;
    };
    style?: React.CSSProperties;
    children?: FunctionComponent<any>;
    styleForCell?: (cell: any, positionInfos: GridPositionnable, styles: React.CSSProperties) => React.CSSProperties;
}
