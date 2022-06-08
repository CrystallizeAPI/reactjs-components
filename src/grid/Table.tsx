import { FunctionComponent } from 'react';
import { getPositionnableCellClassNames, getPositionnablRowClassNames } from './GridRenderer';
import { GridPositionnable, TableGridProps } from './types';

export const Table: FunctionComponent<TableGridProps> = ({
    cellComponent,
    rows,
    children,
    totalColSpan = 4,
    styleForCell,
    ...props
}) => {
    const CellComponent = cellComponent;
    return (
        <table className="crystallize-grid crystallize-grid--table" {...props}>
            <thead>
                <tr>
                    {new Array(totalColSpan).fill(0).map((v, i) => (
                        <th key={`th-${i}`} />
                    ))}
                </tr>
            </thead>
            <tbody>
                {children
                    ? children({ rows, totalColSpan })
                    : rows.map((row: any, i: number) => {
                          return (
                              <tr
                                  key={`row-${i}`}
                                  className={getPositionnablRowClassNames({ rowIndex: i, rowLength: rows.length })}
                              >
                                  {row.columns.map((cell: any, j: number) => {
                                      const positionInfos: GridPositionnable = {
                                          rowIndex: i,
                                          colIndex: j,
                                          rowLength: row.length,
                                          colLength: row.columns.length,
                                      };
                                      const cellStyles = styleForCell
                                          ? styleForCell(cell, positionInfos, {}) || {}
                                          : {};
                                      return (
                                          <td
                                              key={`cell-${i}-${j}`}
                                              className={`crystallize-grid__cell ${getPositionnableCellClassNames(
                                                  positionInfos,
                                              )}`}
                                              style={cellStyles}
                                              rowSpan={cell.layout.rowspan}
                                              colSpan={cell.layout.colspan}
                                          >
                                              <CellComponent cell={cell} totalColSpan={totalColSpan} />
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
