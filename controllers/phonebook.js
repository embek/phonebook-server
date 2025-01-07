const models = require("../models");
const { Op } = require("sequelize");
const path = require('node:path');
const { unlinkSync } = require('node:fs');

const getContacts = async (query) => {
    try {
        query.limit = parseInt(query.limit) || 5;
        query.search = query.search || '';
        query.page = parseInt(query.page) || 1;
        query.sortBy = query.sortBy || 'id';
        query.sortMode = query.sortMode || 'ASC';
        const contacts = await models.Contact.findAndCountAll(
            {
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${query.search}%`
                            }
                        },
                        {
                            phone: {
                                [Op.iLike]: `%${query.search}%`
                            }
                        }
                    ]
                },
                order: [[query.sortBy, query.sortMode]],
                limit: query.limit, offset: (query.page - 1) * query.limit
            }
        );
        const total = contacts.count;
        const pages = Math.ceil(total / query.limit);
        if (query.page > pages) return {
            phonebooks: [],
            page: query.page,
            limit: query.limit,
            pages,
            total
        }
        const response = {
            phonebooks: contacts.rows,
            page: query.page,
            limit: query.limit,
            pages,
            total
        }
        return response;
    } catch (error) {
        throw new Error(`${error.message} gagal get contacts`);
    }
};

const getContactById = async (id) => {
    try {
        const response = await models.Contact.findByPk(id);
        return response;
    } catch (error) {
        throw new Error(`${error.message} gagal get contact by id`);
    }
}

const createContact = async (data) => {//data berisi name dan phone
    try {
        const response = await models.Contact.create(
            {
                name: data.name,
                phone: data.phone
            }
        )
        return response;
    } catch (error) {
        throw new Error(`${error.message} gagal create contact`);
    }
};

const updateContact = async (data) => {//data berisi id, name dan phone
    try {
        const response = await models.Contact.update({
            name: data.name,
            phone: data.phone
        }, {
            where: { id: data.id },
            returning: true,
            plain: true
        })
        return response[1].dataValues;
    } catch (error) {
        throw new Error(`${error.message} gagal update contacts`);
    }
};

const updateAvatar = async (data) => {//data berisi id dan file avatar
    try {
        if (!data.file || Object.keys(data.file).length === 0) throw new Error('no image files were uploaded');

        // Add image file validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const avatar = data.file.avatar;

        if (!allowedTypes.includes(avatar.mimetype)) {
            throw new Error('Only image files (jpeg, png, gif) are allowed');
        }

        const oldContact = await getContactById(data.id);
        if (oldContact.avatar) {
            unlinkSync(path.join(__dirname, '..', 'public', 'images', oldContact.avatar));
        }

        const fileName = path.parse(avatar.name).name + JSON.stringify(Date.now()) + path.extname(avatar.name);
        const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
        await avatar.mv(uploadPath);
        const response = await models.Contact.update({ avatar: fileName }, {
            where: { id: data.id },
            returning: true,
            plain: true
        });
        return response[1].dataValues;
    } catch (error) {
        throw new Error(`${error.message} gagal update avatar`);
    }
}

const deleteContact = async (id) => {
    try {
        const response = await getContactById(id);
        unlinkSync(path.join(__dirname, '..', 'public', 'images', response.avatar));
        await models.Contact.destroy({ where: { id } });
        return response;
    } catch (error) {
        throw new Error(`${error.message} gagal delete contacts`);
    }
};

module.exports = { getContacts, createContact, updateContact, updateAvatar, deleteContact, getContactById };