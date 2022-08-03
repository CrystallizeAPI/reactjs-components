import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames, getPositionnablRowClassNames } from './grid-renderer-utils';
import { GridCell, GridRow, TableGridProps } from './types';

export const Table: FunctionComponent<TableGridProps> = ({
    cellComponent,
    grid,
    children,
    dimensions,
    styleForCell,
    ...props
}) => {
    const CellComponent = cellComponent;
    return (
        <table className="crystallize-grid crystallize-grid--table" {...props}>
            <thead>
                <tr>
                    {new Array(dimensions.cols).fill(0).map((v, i) => (
                        <th key={`th-${i}`} />
                    ))}
                </tr>
            </thead>
            <tbody>
                {children && children({ grid, dimensions })}
                {!children &&
                    grid.map((row: GridRow, rowIndex: number) => {
                        return (
                            <tr
                                key={`row-${rowIndex}`}
                                className={getPositionnablRowClassNames({ rowIndex }, dimensions)}
                            >
                                {row.columns.map((cell: GridCell, cellIndex: number) => {
                                    const cellStyles = styleForCell ? styleForCell(cell, {}) || {} : {};
                                    const classes = getPositionnableCellClassNames(cell, dimensions);
                                    return (
                                        <td
                                            key={`cell-${rowIndex}-${cellIndex}`}
                                            className={`crystallize-grid__cell ${classes}`}
                                            style={cellStyles}
                                            rowSpan={cell.layout.rowspan}
                                            colSpan={cell.layout.colspan}
                                        >
                                            <CellComponent cell={cell} dimensions={dimensions} />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};
