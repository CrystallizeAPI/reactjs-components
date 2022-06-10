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
                id: '62a23c5e860bd16784ae5bec',
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
    expect(grid.rows[1].columns[0].layout.rowspan).toBe(3);
    const gridCells = wrapCellsInRows(grid.rows);

    const check = ([cellRowIndex, cellColIndex], [rowIndex, colIndex]) => {
        expect(gridCells[cellRowIndex][cellColIndex].position.rowIndex).toBe(rowIndex);
        expect(gridCells[cellRowIndex][cellColIndex].position.colIndex).toBe(colIndex);
    };
    check([2, 0], [2, 1]);
    check([2, 1], [2, 3]);
    check([5, 3], [5, 3]);
    check([4, 2], [4, 3]);

    check([6, 0], [6, 0]);
    check([6, 1], [6, 2]);

    check([7, 0], [7, 2]);
    // console.log(gridCells[2]);
});
