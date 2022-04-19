import { FunctionComponent } from 'react';
import { TableGridProps } from './types';

export const Table: FunctionComponent<TableGridProps> = ({
    cellComponent,
    rows,
    children,
    totalColSpan = 4,
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
                              <tr key={`row-${i}`}>
                                  {row.columns.map((col: any, j: number) => (
                                      <td
                                          key={`cell-${i}-${j}`}
                                          className="crystallize-grid__cell"
                                          rowSpan={col.layout.rowspan}
                                          colSpan={col.layout.colspan}
                                      >
                                          <CellComponent cell={col} totalColSpan={totalColSpan} />
                                      </td>
                                  ))}
                              </tr>
                          );
                      })}
            </tbody>
        </table>
    );
};
