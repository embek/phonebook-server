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
                    name: {
                        [Op.like]: `%${query.search}%`
                    }
                },
                order: [[query.sortBy, query.sortMode]],
                limit: query.limit, offset: (query.page - 1) * query.limit
            }
        );
        const total = contacts.count;
        const pages = Math.ceil(total / query.limit);
        if (query.page > pages) return {
            contacts: [],
            page: query.page,
            limit: query.limit,
            pages,
            total,
            message: "Requested page is out of range"
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
        console.log(error, '\ngagal get contacts');
        return new Error('gagal get contacts');
    }
};

const getContactById = async (id) => {
    try {
        const response = await models.Contact.findOne({ where: { id } });
        return response;
    } catch (error) {
        console.log(error, '\ngagal get contact by id');
        return new Error('gagal get contact by id');
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
        console.log(error, '\ngagal create contacts');
        return new Error('gagal create contact');
    }
};

const updateContact = async (data) => {//data berisi id, name dan phone
    try {
        const response = await models.Contact.update({
            name: data.name,
            phone: data.phone
        }, {
            where: { id: data.id }
        }
        )
        return response;
    } catch (error) {
        console.log(error, '\ngagal update contacts');
        return new Error('gagal update contacts');
    }
};

const updateAvatar = async (data) => {//data berisi id dan file avatar
    try {
        if (!data.file || Object.keys(data.file).length === 0) throw new Error('no image files were uploaded');
        const oldContact = await getContactById(data.id);
        if (oldContact.avatar != 'default-avatar.png') {
            unlinkSync(path.join(__dirname, '..', 'public', 'images', oldContact.avatar));
        }
        const newAvatar = data.file.avatar;
        const fileName = JSON.stringify(Date.now()) + newAvatar.name;
        const uploadPath = path.join(__dirname,'..', 'public', 'images', fileName);
        await newAvatar.mv(uploadPath);
        const response = await models.Contact.update({ avatar: fileName }, { where: { id: data.id } });
        return response;
    } catch (error) {
        console.log(error, '\ngagal update avatar');
        return new Error('gagal update avatar');
    }
}

const deleteContact = async (id) => {
    try {
        const response = await models.Contact.destroy({ where: { id } });
        return response;
    } catch (error) {
        console.log(error, '\ngagal delete contacs');
        return new Error('gagal delete contacts');
    }
};

module.exports = { getContacts, createContact, updateContact, updateAvatar, deleteContact, getContactById };