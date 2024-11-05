const chai = require('chai');
const chaiHttp = require('chai-http');
const models = require("../models");
const path = require('node:path');
const app = require('../app');
const { Op } = require('sequelize');

chai.use(chaiHttp);
const assert = chai.assert;

describe('contacts', () => {
    let lastId;
    before(async (done) => {
        try {
            const res = await models.Contact.create({
                name: '#test#abcde',
                phone: '098623423'
            })
            lastId = res.id;
            done();
        } catch (error) {
            console.log(error.message, 'gagal tambah data dummy');
            done();
        }
    });

    it('/GET contacts success', async (done) => {
        try {
            const res = await chai.request(app)
                .get('/api/phonebooks');
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

    it('/GET contacts with query success', async (done) => {
        try {
            const res = await chai.request(app)
                .get('/api/phonebooks?search=b&page=2&limit=2');
            assert.isObject(res);
            assert.equal(res.status, 200)
            assert.hasAllKeys(res, ['phonebooks', 'page', 'limit', 'pages', 'total']);
            assert.isArray(res.phonebooks);
            for (let i = 0; i < res.phonebooks.length; i++) {
                assert.isObject(res.phonebooks[i]);
                assert.hasAllKeys(res.phonebooks[i], ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt'])
                assert.isNotNull(res.phonebooks[i].id);
                assert.isNotNull(res.phonebooks[i].name);
                assert.isNotNull(res.phonebooks[i].phone);
                assert.isNotNull(res.phonebooks[i].createdAt);
                assert.isNotNull(res.phonebooks[i].updatedAt);
            };
            assert.strictEqual(res.page, 2)
            assert.strictEqual(res.limit, 2);
            assert.isNumber(res.pages);
            assert.isNumber(res.total);

            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /GET contacts success');
            done();
        }
    })

    it('/POST contacts success', async (done) => {
        try {
            const res = await chai.request(app)
                .post('/api/phonebooks')
                .send({ name: '#test#qwerty', phone: '7623482' });
            assert.isObject(res);
            assert.equal(res.status, 201)
            assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
            assert.isNotNull(res.id);
            lastId = res.id;
            assert.strictEqual(res.name, '#test#qwerty');
            assert.strictEqual(res.phone, '7623482');
            assert.isNotNull(res.createdAt);
            assert.isNotNull(res.updatedAt);
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /POST contacts success');
            done();
        }
    })

    it('/POST contacts failed', async (done) => {
        try {
            const res = await chai.request(app)
                .post('/api/phonebooks')
                .send({ name: '#test#poiuyt' });
            assert.isObject(res);
            assert.equal(res.status, 500);
            assert.property(res, 'message');
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /POST contacts failed');
            done();
        }
    })

    it('/PUT contacts success', async (done) => {
        try {
            const res = await chai.request(app)
                .put(`/api/phonebooks/${lastId}`)
                .send({ name: '#test#pokmnj', phone: '83497' });
            assert.isObject(res);
            assert.equal(res.status, 201)
            assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
            assert.strictEqual(res.id, lastId);
            assert.strictEqual(res.name, '#test#pokmnj');
            assert.strictEqual(res.phone, '83497');
            assert.isNotNull(res.createdAt);
            assert.isNotNull(res.updatedAt);
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /PUT contacts success');
            done();
        }
    })

    it('/PUT contacts failed', async (done) => {
        try {
            const res = await chai.request(app)
                .put(`/api/phonebooks/${lastId}`)
                .send({});
            assert.isObject(res);
            assert.equal(res.status, 500);
            assert.property(res, 'message');
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /PUT contacts failed');
            done();

        }
    })

    it('/PUT avatar success', async (done) => {
        try {
            let dummyAvatar = path.join(__dirname, '..', 'public', 'images', 'dummy-avatar.jpg');
            const res = await chai.request(app)
                .put(`/api/phonebooks/${lastId}/avatar`)
                .attach('avatar', dummyAvatar);
            assert.isObject(res);
            assert.equal(res.status, 201)
            assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
            assert.strictEqual(res.id, lastId);
            assert.isNotNull(res.name);
            assert.isNotNull(res.phone);
            assert.isNotNull(res.avatar);
            assert.isNotNull(res.createdAt);
            assert.isNotNull(res.updatedAt);
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /PUT avatar success');
            done();
        }
    })

    it('/PUT avatar failed', async (done) => {
        try {
            let dummyAvatar = path.join(__dirname, '..', 'public', 'images', 'dummy-avatar.jpg');
            const res = await chai.request(app)
                .put(`/api/phonebooks/${lastId}/avatar`);
            assert.isObject(res);
            assert.equal(res.status, 400);
            assert.strictEqual(res.message, 'no images were uploaded');
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /PUT avatar failed');
            done();
        }
    })

    // it('/DELETE contacts failed', async (done) => {
    //     try {
    //         const res = await chai.request(app)
    //             .delete(`/api/phonebooks/${lastId}`);
    //         assert.isObject(res);
    //         assert.equal(res.status, 200)
    //         assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
    //         assert.strictEqual(res.id, lastId);
    //         lastId--;
    //         assert.isNotNull(res.name);
    //         assert.isNotNull(res.phone);
    //         assert.isNotNull(res.createdAt);
    //         assert.isNotNull(res.updatedAt);
    //         done();
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /DELETE contacts success');
    //         done();
    //     }
    // })

    it('/DELETE contacts success', async (done) => {
        try {
            const res = await chai.request(app)
                .delete(`/api/phonebooks/${lastId}`);
            assert.isObject(res);
            assert.equal(res.status, 200)
            assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
            assert.strictEqual(res.id, lastId);
            lastId--;
            assert.isNotNull(res.name);
            assert.isNotNull(res.phone);
            assert.isNotNull(res.createdAt);
            assert.isNotNull(res.updatedAt);
            done();
        } catch (error) {
            console.log(error.message, 'gagal tes /DELETE contacts success');
            done();
        }
    })

    after(async (done) => {
        try {
            await models.Contact.destroy({
                where:
                {
                    name:
                        { [Op.like]: '#test#%' }
                }
            });
            done();
        } catch (error) {
            console.log(error.message, 'gagal hapus data dummy');
            done();
        }
    })
})