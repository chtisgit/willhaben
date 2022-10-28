const assert = require('assert');
const wh = require('../app')

describe('Willhaben API', () => {
    it('should return results', function (done) {
        this.timeout(10000);
        wh.getListings('https://willhaben.at/iad/kaufen-und-verkaufen/marktplatz/pc-komponenten-5878').then(listings => {
            assert.notEqual(listings.length, 0, "length of result is 0");
            done();
        });
    });

    it('should generate an URL for searching soccer balls with paylivery option that returns up to 10 results', function(done) {
        this.timeout(10000);

        const params = {
            count: 10,
            category: wh.Category['sport-fussball'],
            condition: [wh.Condition.neu, wh.Condition.neuwertig],
            keyword: 'ball',
            paylivery: true,
        };

        let builder = wh.default
            .count(params.count)
            .category(params.category)
            .keyword(params.keyword)
            .paylivery(params.paylivery);
        
        for (const cond of params.condition) {
            builder = builder.condition(cond);            
        }
        const urlstring = builder.getURL();

        const url = new URL(urlstring);
        const rows = url.searchParams.get('rows');
        const treeAttributes = url.searchParams.getAll('treeAttributes').map(n => +n);
        const paylivery = url.searchParams.get('paylivery');
        const keyword = url.searchParams.get('keyword');

        assert.equal(params.count, +rows, 'max number of results don\'t match');
        assert.equal(paylivery, ''+params.paylivery, 'paylivery option not set correctly');
        assert.equal(keyword, params.keyword, 'keyword not matching');

        for (const cond of builder.searchContition) {
            assert.equal(treeAttributes.includes(cond), true, 'treeAttributes does not include one of the search conditions');
        }

        for (const t of builder.searchTransferType) {
            assert.equal(treeAttributes.includes(t), true, 'treeAttributes does not include one of the search transfer type');
        }

        done();
    });

});