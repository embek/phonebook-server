const models = require("../models");
const { Op } = require("sequelize");

const getContacts = async (query) => {
    try {

        query.limit = parseInt(query.limit) || 5;
        query.search = query.search || '';
        query.page = query.page || 1;
        query.sortMode = query.sortMode || 'ASC';
        const contacts = await models.Contact.findAndCountAll(
            {
                where: {
                    name: {
                        [Op.like]: `%${query.search}%`
                    }
                }
            },
            { order: [['name', query.sortMode]] }
        );
        const total = contacts.count;
        const pages = Math.ceil(total / query.limit);
        // console.log(contacts);
        const response = {
            phonebooks: contacts.rows,
            page: query.page,
            limit: query.limit,
            pages,
            total
        }
        return response;
    } catch (error) {
        console.log(error, '\ngagal get contacts')
    }
};

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
        console.log(error, '\ngagal create contacts')
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
        console.log(error, '\ngagal update contacts')
    }
};

const updateAvatar = async (data) => {//data berisi id dan avatar
    try {
        const response = await models.Contact.update({ avatar: data.avatar }, { where: { id: data.id } })
    } catch (error) {
        console.log(error, '\ngagal update avatar')
    }
}

const deleteContact = async (id) => {
    try {
        const response = await models.Contact.destroy({ where: { id } });
        return response;
    } catch (error) {
        console.log(error, '\ngagal delete contacs')
    }
};

module.exports = { getContacts, createContact, updateContact, updateAvatar, deleteContact };