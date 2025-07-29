import { FunctionComponent } from 'react';
import { CSSGrid } from './CSSGrid.js';
import { getGridDimensions } from './grid-renderer-utils.js';
import { RowCol } from './RowCol.js';
import { Table } from './Table.js';
import {
    GridRow,
    GridCell,
    GridRendererProps,
    GridRenderingType,
    TableGridProps,
    RowColGridProps,
    CSSGridProps,
} from './types.js';

export const GridRenderer: FunctionComponent<GridRendererProps> = ({
    cellComponent,
    children,
    grid,
    type = GridRenderingType.Div,
    styleForCell,
    ...props
}) => {
    if (!cellComponent && !children) {
        console.error(`@crystallize/grid-renderer: missing 'cellComponent' or children function`);
        return null;
    }
    if (!grid.rows.length) return null;
    const dimensions = getGridDimensions(grid.rows);

    if (type === GridRenderingType.Table) {
        const tableChildren = children as TableGridProps['children'];
        return (
            <Table
                cellComponent={cellComponent}
                grid={grid.rows}
                dimensions={dimensions}
                styleForCell={styleForCell}
                {...props}
            >
                {tableChildren}
            </Table>
        );
    }
    if (type === GridRenderingType.RowCol) {
        const rowColChildren = children as RowColGridProps['children'];
        return (
            <RowCol
                cellComponent={cellComponent}
                grid={grid.rows}
                dimensions={dimensions}
                styleForCell={styleForCell}
                {...props}
            >
                {rowColChildren}
            </RowCol>
        );
    }

    const cells = grid.rows.reduce<GridCell[]>((memo, row) => memo.concat(row.columns), []);

    const cssGridChildren = children as CSSGridProps['children'];
    return (
        <CSSGrid
            cellComponent={cellComponent}
            cells={cells}
            dimensions={dimensions}
            styleForCell={styleForCell}
            {...props}
        >
            {cssGridChildren}
        </CSSGrid>
    );
};
