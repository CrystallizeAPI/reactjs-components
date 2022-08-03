import React, { FunctionComponent } from 'react';

export enum GridRenderingType {
    Table = 'table',
    Div = 'div',
    RowCol = 'row-col',
    CSSGrid = 'CSSGrid',
}

export type GridDimensions = {
    rows: number;
    cols: number;
};

export type GridCell = {
    layout: {
        rowspan: number;
        colspan: number;
        rowIndex: number;
        colIndex: number;
    };
};

export type GridRow = {
    columns: GridCell[];
};

export interface GridRendererProps {
    cellComponent: React.FunctionComponent<{ cell: any; dimensions: GridDimensions }>;
    type: GridRenderingType;
    grid: {
        rows: GridRow[];
    };
    style?: React.CSSProperties;
    children?: FunctionComponent<any>;
    styleForCell?: (cell: GridCell, styles: React.CSSProperties) => React.CSSProperties;
}

export interface CSSGridProps {
    cellComponent: React.FunctionComponent<{ cell: any; dimensions: GridDimensions }>;
    cells: GridCell[];
    children?: FunctionComponent<any>;
    dimensions: GridDimensions;
    style?: React.CSSProperties;
    styleForCell?: (cell: GridCell, styles: React.CSSProperties) => React.CSSProperties;
}

export interface TableGridProps {
    cellComponent: React.FunctionComponent<{ cell: any; dimensions: GridDimensions }>;
    grid: GridRow[];
    children?: FunctionComponent<any>;
    dimensions: GridDimensions;
    style?: React.CSSProperties;
    styleForCell?: (cell: GridCell, styles: React.CSSProperties) => React.CSSProperties;
}

export interface RowColGridProps {
    cellComponent: React.FunctionComponent<{ cell: any; dimensions: GridDimensions }>;
    grid: GridRow[];
    children?: FunctionComponent<any>;
    dimensions: GridDimensions;
    style?: React.CSSProperties;
    styleForCell?: (cell: GridCell, styles: React.CSSProperties) => React.CSSProperties;
}
