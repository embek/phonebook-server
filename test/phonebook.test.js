const chai = require('chai');
const chaiHttp = require('chai-http');
const models = require("../models");
const app = require('../app');

chai.use(chaiHttp);
const assert = chai.assert;

describe('contacs', () => {
    before(async (done) => {
        try {
            await models.Contact.create({
                name: '#test#abcde',
                phone: '098623423'
            })
            done();
        } catch (error) {
            console.log(error.message, 'gagal tambah data dummy');
            done();
        }
    });

    it('/GET contacts success', async (done) => {
        try {
            const res = await chai.request(app).get('/api/phonebooks');
            assert.isObject(res);
            assert.equal(res.status, 200)
            assert.hasAllKeys(res, ['phonebooks', 'page', 'limit', 'total']);
            assert.isArray(res.phonebooks);
            for (let i = 0; i < res.phonebooks.length; i++) {
                assert.isObject(res.phonebooks[i]);
                assert.hasAllKeys(res.phonebooks[i], ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt'])
                assert.isNotNull(res.phonebooks[i].id);
                assert.isNotNull(res.phonebooks[i].name);
                assert.isNotNull(res.phonebooks[i].phone);
                assert.isNotNull(res.phonebooks[i].createdAt);
                assert.isNotNull(res.phonebooks[i].updatedAt);
            }
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /GET contacts success');
            done();
        }
    })
})