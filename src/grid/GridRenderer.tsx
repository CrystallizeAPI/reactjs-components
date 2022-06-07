import { FunctionComponent } from 'react';
import { CSSGrid } from './CSSGrid';
import { RowCol } from './RowCol';
import { Table } from './Table';
import { GridRendererProps, GridRenderingType } from './types';

const getTotalGridDimensions = (rows: any[]): number => {
    const totalColSpan = rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0);
    return totalColSpan;
};

export function getPositionnableCellClassNames(
    rowIndex: number,
    colIndex: number,
    rowLength: number,
    colLength: number,
): string {
    return `cell-${rowIndex}-${colIndex} ${rowIndex == 0 ? 'first-row' : ''} ${colIndex == 0 ? 'first-col' : ''} ${
        rowIndex === rowLength - 1 ? 'last-row' : ''
    } ${colIndex === colLength - 1 ? 'last-col' : ''}`.replace(/\s+/g, ' ');
}

export function getPositionnablRowClassNames(rowIndex: number, rowLength: number): string {
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
            <Table cellComponent={cellComponent} rows={rows} totalColSpan={totalColSpan} {...props}>
                {children}
            </Table>
        );
    }
    if (type === GridRenderingType.RowCol) {
        return (
            <RowCol cellComponent={cellComponent} rows={rows} totalColSpan={totalColSpan} {...props}>
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
        <CSSGrid cellComponent={cellComponent} cells={cells} totalColSpan={totalColSpan} {...props}>
            {children}
        </CSSGrid>
    );
};
