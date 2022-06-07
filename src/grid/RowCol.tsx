import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames, getPositionnablRowClassNames } from './GridRenderer';
import { RowColGridProps } from './types';

export const RowCol: FunctionComponent<RowColGridProps> = ({
    cellComponent,
    rows,
    children,
    totalColSpan = 4,
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
                              className={`crystallize-grid-row row ${getPositionnablRowClassNames(i, rows.length)}`}
                              key={`row-${i}`}
                          >
                              {row.columns.map((col: any, j: number) => (
                                  <div
                                      className={`crystallize-grid-col crystallize-grid__cell col ${getPositionnableCellClassNames(
                                          i,
                                          j,
                                          row.length,
                                          row.columns.length,
                                      )}`}
                                      key={`cell-${i}-${j}`}
                                  >
                                      <CellComponent cell={col} totalColSpan={totalColSpan} />
                                  </div>
                              ))}
                          </div>
                      );
                  })}
        </div>
    );
};
