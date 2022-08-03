import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames, getPositionnablRowClassNames } from './grid-renderer-utils';
import { GridRow, GridCell, RowColGridProps } from './types';

export const RowCol: FunctionComponent<RowColGridProps> = ({
    cellComponent,
    grid,
    children,
    dimensions,
    styleForCell,
    ...props
}) => {
    const CellComponent = cellComponent;
    return (
        <div className="crystallize-grid crystallize-row-col-table" {...props}>
            {children && children({ grid, dimensions })}
            {!children &&
                grid.map((row: GridRow, rowIndex: number) => {
                    return (
                        <div
                            key={`row-${rowIndex}`}
                            className={`crystallize-grid-row row ${getPositionnablRowClassNames(
                                { rowIndex },
                                dimensions,
                            )}`}
                        >
                            {row.columns.map((cell: GridCell, cellIndex: number) => {
                                const cellStyles = styleForCell ? styleForCell(cell, {}) || {} : {};
                                const classes = getPositionnableCellClassNames(cell, dimensions);
                                return (
                                    <div
                                        key={`cell-${rowIndex}-${cellIndex}`}
                                        className={`crystallize-grid__cell col ${classes}`}
                                        style={cellStyles}
                                    >
                                        <CellComponent cell={cell} dimensions={dimensions} />
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
        </div>
    );
};
