import { FunctionComponent } from 'react';
import { CSSGridProps } from './types';

export const CSSGrid: FunctionComponent<CSSGridProps> = ({
    cellComponent,
    cells,
    children,
    totalColSpan = 4,
    style,
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
                ? children({ cells, totalColSpan })
                : cells.map((cell: any, i: number) => (
                      <div
                          key={`cell-${i}`}
                          className="crystallize-grid__cell"
                          style={{
                              gridColumn: `span ${cell.layout.colspan}`,
                              gridRow: `span ${cell.layout.rowspan}`,
                          }}
                      >
                          <CellComponent cell={cell} totalColSpan={totalColSpan} />
                      </div>
                  ))}
        </div>
    );
};
