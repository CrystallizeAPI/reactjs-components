import { FunctionComponent } from 'react';
import { CSSGrid } from './CSSGrid';
import { Table } from './Table';
import { GridRendererProps, GridRenderingType } from './types';

const getTotalGridDimensions = (rows: any[]): number => {
    const totalColSpan = rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0);
    return totalColSpan;
};

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
    if (type === 'table') {
        return (
            <Table cellComponent={cellComponent} rows={rows} totalColSpan={totalColSpan} {...props}>
                {children}
            </Table>
        );
    }
    // Currently the data is only returned in a nested array of rows and
    // columns. To make use of CSS Grid we need a flat array of all of the
    // individual cells.
    const columns = rows.map((row: { columns: any }) => row.columns);
    const cells = [].concat.apply([], columns);

    return (
        <CSSGrid cellComponent={cellComponent} cells={cells} totalColSpan={totalColSpan} {...props}>
            {children}
        </CSSGrid>
    );
};
