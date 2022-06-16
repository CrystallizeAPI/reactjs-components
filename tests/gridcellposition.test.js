const { createCatalogueFetcher, createClient, catalogueFetcherGraphqlBuilder } = require('@crystallize/js-api-client');
const { wrapCellsInRows } = require('../dist/grid/grid-renderer-utils');

test('Get a Grid and check the position', async () => {
    const CrystallizeClient = createClient({
        tenantIdentifier: 'frntr',
    });
    const fetch = createCatalogueFetcher(CrystallizeClient);
    const builder = catalogueFetcherGraphqlBuilder;
    const query = {
        grid: {
            __args: {
                id: '626ea0599161f671155db9a9',
                language: 'en',
            },
            id: true,
            name: true,
            rows: {
                columns: {
                    layout: {
                        rowspan: true,
                        colspan: true,
                    },
                    item: {
                        __on: [builder.onItem()],
                    },
                },
            },
        },
    };
    const grid = (await fetch(query)).grid;

    expect(grid.rows[0].columns[0].layout.rowspan).toBe(1);
    expect(grid.rows[1].columns[0].layout.rowspan).toBe(1);
    expect(grid.rows[5].columns[0].layout.rowspan).toBe(2);
    const gridCells = wrapCellsInRows(grid.rows);

    const check = ([cellRowIndex, cellColIndex], [rowIndex, colIndex]) => {
        expect(gridCells[cellRowIndex][cellColIndex].position.rowIndex).toBe(rowIndex);
        expect(gridCells[cellRowIndex][cellColIndex].position.colIndex).toBe(colIndex);
    };

    check([1, 0], [1, 0]);
    check([2, 0], [2, 0]);
    check([6, 0], [6, 2]);
});
