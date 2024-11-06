const chai = require('chai');
const chaiHttp = require('chai-http');
const models = require("../models");
const path = require('node:path');
const app = require('../app');
const { Op } = require('sequelize');

chai.use(chaiHttp);
const assert = chai.assert;

describe('tes CRUD contacts', () => {
    let lastId = 5;
    before(async () => {
        try {
            const res = await models.Contact.create({
                name: '#test#abcde',
                phone: '098623423'
            })
            lastId = res.id;

        } catch (error) {
            console.log(error.message, 'gagal tambah data dummy');

        }
    });

    // it('/GET contacts success', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .get('/api/phonebooks');
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(res.status, 200)
    //         assert.hasAllKeys(res, ['phonebooks', 'page', 'limit', 'pages', 'total']);
    //         assert.isArray(res.phonebooks);
    //         for (let i = 0; i < res.phonebooks.length; i++) {
    //             assert.isObject(res.phonebooks[i]);
    //             assert.hasAllKeys(res.phonebooks[i], ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt'])
    //             assert.isNotNull(res.phonebooks[i].id);
    //             assert.isNotNull(res.phonebooks[i].name);
    //             assert.isNotNull(res.phonebooks[i].phone);
    //             assert.isNotNull(res.phonebooks[i].createdAt);
    //             assert.isNotNull(res.phonebooks[i].updatedAt);
    //         }
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /GET contacts success');
    //     }
    // })

    // it('/GET contacts with query success', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .get('/api/phonebooks?search=b&page=2&limit=2');
    //         console.log(response);
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 200)
    //         assert.hasAllKeys(res, ['phonebooks', 'page', 'limit', 'pages', 'total']);
    //         assert.isArray(res.phonebooks);
    //         for (let i = 0; i < res.phonebooks.length; i++) {
    //             assert.isObject(res.phonebooks[i]);
    //             assert.hasAllKeys(res.phonebooks[i], ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt'])
    //             assert.isNotNull(res.phonebooks[i].id);
    //             assert.isNotNull(res.phonebooks[i].name);
    //             assert.isNotNull(res.phonebooks[i].phone);
    //             assert.isNotNull(res.phonebooks[i].createdAt);
    //             assert.isNotNull(res.phonebooks[i].updatedAt);
    //         };
    //         assert.strictEqual(res.page, 2)
    //         assert.strictEqual(res.limit, 2);
    //         assert.isNumber(res.pages);
    //         assert.isNumber(res.total);
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /GET contacts success');
    //     }
    // })

    // it('/POST contacts success', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .post('/api/phonebooks')
    //             .send({ name: '#test#qwerty', phone: '7623482' });
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 201)
    //         assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
    //         assert.isNotNull(res.id);
    //         lastId = res.id;
    //         assert.strictEqual(res.name, '#test#qwerty');
    //         assert.strictEqual(res.phone, '7623482');
    //         assert.isNotNull(res.createdAt);
    //         assert.isNotNull(res.updatedAt);
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /POST contacts success');
    //     }
    // })

    // it('/POST contacts failed', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .post('/api/phonebooks')
    //             .send({ name: '#test#poiuyt' });
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 500);
    //         assert.property(res, 'message');
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /POST contacts failed');
    //     }
    // })

    it('/PUT contacts success', async () => {
        try {
            const response = await chai.request(app)
                .put(`/api/phonebooks/${lastId}`)
                .send({ name: '#test#pokmnj', phone: '83497' });
            const res = response._body;
            assert.isObject(res);
            assert.equal(response.status, 201)
            assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
            assert.strictEqual(res.id, lastId);
            assert.strictEqual(res.name, '#test#pokmnj');
            assert.strictEqual(res.phone, '83497');
            assert.isNotNull(res.createdAt);
            assert.isNotNull(res.updatedAt);
        } catch (error) {
            console.log(error.message, 'gagal tes /PUT contacts success');
        }
    })

    // it('/PUT contacts failed', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .put(`/api/phonebooks/${lastId}`)
    //             .send({});
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 500);
    //         assert.property(res, 'message');
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /PUT contacts failed');
    //     }
    // })

    // it('/PUT avatar success', async () => {
    //     try {
    //         let dummyAvatar = path.join(__dirname, '..', 'public', 'images', 'dummy-avatar.jpg');
    //         const response = await chai.request(app)
    //             .put(`/api/phonebooks/${lastId}/avatar`)
    //             .attach('avatar', dummyAvatar);
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 201)
    //         assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
    //         assert.strictEqual(res.id, lastId);
    //         assert.isNotNull(res.name);
    //         assert.isNotNull(res.phone);
    //         assert.isNotNull(res.avatar);
    //         assert.isNotNull(res.createdAt);
    //         assert.isNotNull(res.updatedAt);
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /PUT avatar success');
    //     }
    // })

    // it('/PUT avatar failed', async () => {
    //     try {
    //         let dummyAvatar = path.join(__dirname, '..', 'public', 'images', 'dummy-avatar.jpg');
    //         const response = await chai.request(app)
    //             .put(`/api/phonebooks/${lastId}/avatar`);
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 400);
    //         assert.strictEqual(res.message, 'no images were uploaded');
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /PUT avatar failed');
    //     }
    // })

    // it('/DELETE contacts failed', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .delete(`/api/phonebooks/${lastId}`);
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 200)
    //         assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
    //         assert.strictEqual(res.id, lastId);
    //         lastId--;
    //         assert.isNotNull(res.name);
    //         assert.isNotNull(res.phone);
    //         assert.isNotNull(res.createdAt);
    //         assert.isNotNull(res.updatedAt);
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /DELETE contacts success');
    //     }
    // })

    // it('/DELETE contacts success', async () => {
    //     try {
    //         const response = await chai.request(app)
    //             .delete(`/api/phonebooks/${lastId}`);
    //         const res = response._body;
    //         assert.isObject(res);
    //         assert.equal(response.status, 200)
    //         assert.hasAllKeys(res, ['id', 'name', 'phone', 'avatar', 'createdAt', 'updatedAt']);
    //         assert.strictEqual(res.id, lastId);
    //         lastId--;
    //         assert.isNotNull(res.name);
    //         assert.isNotNull(res.phone);
    //         assert.isNotNull(res.createdAt);
    //         assert.isNotNull(res.updatedAt);
    //     } catch (error) {
    //         console.log(error.message, 'gagal tes /DELETE contacts success');
    //     }
    // })

    after(async () => {
        try {
            await models.Contact.destroy({
                where:
                {
                    name:
                        { [Op.like]: '#test#%' }
                }
            });
        } catch (error) {
            console.log(error.message, 'gagal hapus data dummy');
        }
    })
})