import { FunctionComponent } from 'react';
import { CSSGrid } from './CSSGrid';
import { RowCol } from './RowCol';
import { Table } from './Table';
import { GridPositionnable, GridRendererProps, GridRenderingType } from './types';

const getTotalGridDimensions = (rows: any[]): number => {
    const totalColSpan = rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0);
    return totalColSpan;
};

export function getPositionnableCellClassNames({
    rowIndex,
    colIndex,
    rowLength,
    colLength,
}: GridPositionnable): string {
    return `cell-${rowIndex}-${colIndex} ${rowIndex == 0 ? 'first-row' : ''} ${colIndex == 0 ? 'first-col' : ''} ${
        rowIndex === rowLength - 1 ? 'last-row' : ''
    } ${colIndex === colLength - 1 ? 'last-col' : ''}`.replace(/\s+/g, ' ');
}

export function getPositionnablRowClassNames({
    rowIndex,
    rowLength,
}: Omit<GridPositionnable, 'colIndex' | 'colLength'>): string {
    return `row-${rowIndex} ${rowIndex == 0 ? 'first-row' : ''} ${rowIndex == rowLength - 1 ? 'last-row' : ''}`.replace(
        /\s+/g,
        ' ',
    );
}

export const GridRenderer: FunctionComponent<GridRendererProps> = ({
    cellComponent,
    children,
    grid,
    type = GridRenderingType.Div,
    styleForCell,
    ...props
}) => {
    if (!cellComponent && !children) {
        console.error('@crystallize/grid-renderer: missing ´cellComponent` or children function');
        return null;
    }
    const { rows } = grid;

    if (!rows.length) return null;
    const totalColSpan = getTotalGridDimensions(rows);
    if (type === GridRenderingType.Table) {
        return (
            <Table
                cellComponent={cellComponent}
                rows={rows}
                totalColSpan={totalColSpan}
                styleForCell={styleForCell}
                {...props}
            >
                {children}
            </Table>
        );
    }
    if (type === GridRenderingType.RowCol) {
        return (
            <RowCol
                cellComponent={cellComponent}
                rows={rows}
                totalColSpan={totalColSpan}
                styleForCell={styleForCell}
                {...props}
            >
                {children}
            </RowCol>
        );
    }
    const cells = rows.reduce((accumulator: any[], row: { columns: any }, rowIndex: number) => {
        row.columns.forEach((col: any, colIndex: number) => {
            accumulator.push({
                ...col,
                position: [rowIndex, colIndex, rows.length, row.columns.length],
            });
        });
        return accumulator;
    }, []);
    return (
        <CSSGrid
            cellComponent={cellComponent}
            cells={cells}
            totalColSpan={totalColSpan}
            styleForCell={styleForCell}
            {...props}
        >
            {children}
        </CSSGrid>
    );
};
