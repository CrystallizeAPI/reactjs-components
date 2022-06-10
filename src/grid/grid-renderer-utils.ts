import { GridCell, GridDimensions, GridPosition } from './types';

export const getGridDimensions = (rows: any[]): GridDimensions => {
    return {
        rows: rows.length,
        cols: rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0),
    };
};

export function getPositionnableCellClassNames(cell: GridCell, { rows, cols }: GridDimensions): string {
    const { rowIndex, colIndex } = cell.position;
    const { colspan, rowspan } = cell.layout;
    const isLastRow = rowIndex + rowspan === rows;
    const isLastCol = colIndex + colspan === cols;

    return `cell-${rowIndex}-${colIndex} ${rowIndex == 0 ? 'first-row' : ''} ${colIndex == 0 ? 'first-col' : ''} ${
        isLastRow ? 'last-row' : ''
    } ${isLastCol ? 'last-col' : ''}`.replace(/\s+/g, ' ');
}

export function getPositionnablRowClassNames(
    { rowIndex }: Omit<GridPosition, 'colIndex'>,
    { rows }: GridDimensions,
): string {
    return `row-${rowIndex} ${rowIndex == 0 ? 'first-row' : ''} ${rowIndex == rows - 1 ? 'last-row' : ''}`.replace(
        /\s+/g,
        ' ',
    );
}

export function wrapCellsInRows(rows: any[]): GridCell[][] {
    const dimensions = getGridDimensions(rows);
    let memoryMap: { colspan: number; rowspan: number }[] = new Array(dimensions.cols).fill({ colspan: 1, rowspan: 1 });

    const grid = rows.map((row: any, rowIndex: number) => {
        let colspanOffset = 0;
        let rowspanOffset = 0;
        return row.columns.map((cell: any) => {
            if (memoryMap[colspanOffset]?.rowspan > 1) {
                rowspanOffset = memoryMap[colspanOffset].colspan;
                memoryMap[colspanOffset].rowspan--;
            } else {
                rowspanOffset = 0;
            }
            const positionInfos: GridPosition = {
                rowIndex,
                colIndex: colspanOffset + rowspanOffset,
            };
            memoryMap[positionInfos.colIndex] = {
                ...cell.layout,
            };
            colspanOffset += cell.layout.colspan + rowspanOffset;
            return {
                ...cell,
                position: positionInfos,
                layout: {
                    colspan: cell.layout.colspan,
                    rowspan: cell.layout.rowspan,
                },
            };
        });
    });
    return grid;
}
