import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames, getPositionnablRowClassNames } from './GridRenderer';
import { GridPositionnable, RowColGridProps } from './types';

export const RowCol: FunctionComponent<RowColGridProps> = ({
    cellComponent,
    rows,
    children,
    totalColSpan = 4,
    styleForCell,
    ...props
}) => {
    const CellComponent = cellComponent;
    return (
        <div className="crystallize-grid crystallize-row-col-table" {...props}>
            {children
                ? children({ rows, totalColSpan })
                : rows.map((row: any, i: number) => {
                      return (
                          <div
                              className={`crystallize-grid-row row ${getPositionnablRowClassNames({
                                  rowIndex: i,
                                  rowLength: rows.length,
                              })}`}
                              key={`row-${i}`}
                          >
                              {row.columns.map((cell: any, j: number) => {
                                  const positionInfos: GridPositionnable = {
                                      rowIndex: i,
                                      colIndex: j,
                                      rowLength: row.length,
                                      colLength: row.columns.length,
                                  };
                                  const cellStyles = styleForCell ? styleForCell(cell, positionInfos, {}) || {} : {};
                                  return (
                                      <div
                                          className={`crystallize-grid-col crystallize-grid__cell col ${getPositionnableCellClassNames(
                                              positionInfos,
                                          )}`}
                                          style={cellStyles}
                                          key={`cell-${i}-${j}`}
                                      >
                                          <CellComponent cell={cell} totalColSpan={totalColSpan} />
                                      </div>
                                  );
                              })}
                          </div>
                      );
                  })}
        </div>
    );
};
