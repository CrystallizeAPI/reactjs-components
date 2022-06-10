import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames } from './grid-renderer-utils';
import { CSSGridProps, GridCell } from './types';

export const CSSGrid: FunctionComponent<CSSGridProps> = ({
    cellComponent,
    cells,
    children,
    dimensions,
    style,
    styleForCell,
    ...props
}) => {
    const CellComponent = cellComponent;
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${dimensions.cols}, 1fr)`,
                ...style,
            }}
            className="crystallize-grid crystallize-grid--css-grid"
            {...props}
        >
            {children && children({ cells, dimensions })}
            {!children &&
                cells.map((cell: GridCell, i: number) => {
                    const defaultStyles = {
                        gridColumn: `span ${cell.layout.colspan}`,
                        gridRow: `span ${cell.layout.rowspan}`,
                    };
                    const cellStyles = styleForCell
                        ? styleForCell(cell, defaultStyles) || defaultStyles
                        : defaultStyles;
                    return (
                        <div
                            key={`cell-${i}`}
                            className={`crystallize-grid__cell ${getPositionnableCellClassNames(cell, dimensions)}`}
                            style={cellStyles}
                        >
                            <CellComponent cell={cell} dimensions={dimensions} />
                        </div>
                    );
                })}
        </div>
    );
};
