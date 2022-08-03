const { createCatalogueFetcher, createClient, catalogueFetcherGraphqlBuilder } = require('@crystallize/js-api-client');

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
                        rowIndex: true,
                        colIndex: true,
                    },
                    item: {
                        __on: [builder.onItem()],
                    },
                },
            },
        },
    };
    const grid = (await fetch(query)).grid;

    for (const row of grid.rows) {
        for (const cell of row.columns) {
            expect(typeof cell.layout.colspan).toBe('number');
            expect(typeof cell.layout.rowspan).toBe('number');
            expect(typeof cell.layout.colIndex).toBe('number');
            expect(typeof cell.layout.rowIndex).toBe('number');
        }
    }
});
