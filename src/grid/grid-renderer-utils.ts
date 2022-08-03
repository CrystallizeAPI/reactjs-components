import { GridCell, GridDimensions } from './types';

export const getGridDimensions = (rows: any[]): GridDimensions => {
    return {
        rows: rows.length,
        cols: rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0),
    };
};

export function getPositionnableCellClassNames(cell: GridCell, { rows, cols }: GridDimensions): string {
    const { colspan, rowspan, rowIndex, colIndex } = cell.layout;
    const isLastRow = rowIndex + rowspan === rows;
    const isLastCol = colIndex + colspan === cols;

    return `cell-${rowIndex}-${colIndex} ${rowIndex == 0 ? 'first-row' : ''} ${colIndex == 0 ? 'first-col' : ''} ${
        isLastRow ? 'last-row' : ''
    } ${isLastCol ? 'last-col' : ''}`.replace(/\s+/g, ' ');
}

export function getPositionnablRowClassNames({ rowIndex }: { rowIndex: number }, { rows }: GridDimensions): string {
    return `row-${rowIndex} ${rowIndex == 0 ? 'first-row' : ''} ${rowIndex == rows - 1 ? 'last-row' : ''}`.replace(
        /\s+/g,
        ' ',
    );
}
