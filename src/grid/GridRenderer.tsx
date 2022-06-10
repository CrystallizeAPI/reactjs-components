import { FunctionComponent } from 'react';
import { CSSGrid } from './CSSGrid';
import { getGridDimensions, wrapCellsInRows } from './grid-renderer-utils';
import { RowCol } from './RowCol';
import { Table } from './Table';
import { GridCell, GridRendererProps, GridRenderingType } from './types';

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
    if (!grid.rows.length) return null;
    const dimensions = getGridDimensions(grid.rows);
    const rows = wrapCellsInRows(grid.rows);

    if (type === GridRenderingType.Table) {
        return (
            <Table
                cellComponent={cellComponent}
                grid={rows}
                dimensions={dimensions}
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
                grid={rows}
                dimensions={dimensions}
                styleForCell={styleForCell}
                {...props}
            >
                {children}
            </RowCol>
        );
    }

    const cells = rows.reduce((accumulator: GridCell[], row: GridCell[], rowIndex: number) => {
        row.forEach((cell: GridCell) => {
            accumulator.push(cell);
        });
        return accumulator;
    }, []);
    return (
        <CSSGrid
            cellComponent={cellComponent}
            cells={cells}
            dimensions={dimensions}
            styleForCell={styleForCell}
            {...props}
        >
            {children}
        </CSSGrid>
    );
};
