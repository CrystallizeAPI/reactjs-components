import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames } from './GridRenderer';
import { CSSGridProps, GridPositionnable } from './types';

export const CSSGrid: FunctionComponent<CSSGridProps> = ({
    cellComponent,
    cells,
    children,
    totalColSpan = 4,
    style,
    styleForCell,
    ...props
}) => {
    const CellComponent = cellComponent;
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${totalColSpan}, 1fr)`,
                ...style,
            }}
            className="crystallize-grid crystallize-grid--css-grid"
            {...props}
        >
            {children
                ? children({ cells, totalColSpan, styleForCell })
                : cells.map((cell: any, i: number) => {
                      const defaultStyles = {
                          gridColumn: `span ${cell.layout.colspan}`,
                          gridRow: `span ${cell.layout.rowspan}`,
                      };
                      const positionInfos: GridPositionnable = {
                          rowIndex: cell.position[0],
                          colIndex: cell.position[1],
                          rowLength: cell.position[2],
                          colLength: cell.position[3],
                      };
                      const cellStyles = styleForCell
                          ? styleForCell(cell, positionInfos, defaultStyles) || defaultStyles
                          : defaultStyles;
                      return (
                          <div
                              key={`cell-${i}`}
                              className={`crystallize-grid__cell ${getPositionnableCellClassNames(positionInfos)}`}
                              style={cellStyles}
                          >
                              <CellComponent cell={cell} totalColSpan={totalColSpan} />
                          </div>
                      );
                  })}
        </div>
    );
};
