const Contact = require("./contact");

const getContacts = async (query) => {
    try {

        query.limit = parseInt(query.limit) || 5;
        query.search = query.search || '';
        query.page = query.page || 1;
        query.sortMode = query.sortMode || 'ASC';
        const contacts = await Contact.findAll({ where: { [Op.like]: `%${query.search}%` } }, { order: ['name', query.sortMode] });
        const total = await Contact.findAll({ where: { [Op.like]: `%${query.search}%` } });
        const pages = Math.ceil(total / query.limit);
        // console.log(contacts);
        const response = {
            phonebooks: contacts,
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
        await Contact.create(
            {
                name: data.name,
                phone: data.phone
            }
        )
    } catch (error) {
        console.log(error, '\ngagal create contacts')
    }
};

const updateContact = async (data) => {//data berisi id, name dan phone
    try {
        await Contact.update(
            {
                name: data.name,
                phone: data.phone
            },
            {
                where: { id: data.id }
            }
        )
    } catch (error) {
        console.log(error, '\ngagal update contacts')
    }
};

const updateAvatar = async (data) => {//data berisi id dan avatar
    try {
        await Contact.update({ avatar: data.avatar }, { where: { id: data.id } })
    } catch (error) {
        console.log(error, '\ngagal update avatar')
    }
}

const deleteContact = async (id) => {
    try {
        await Contact.destroy({ where: { id } });
    } catch (error) {
        console.log(error, '\ngagal delete contacs')
    }
};

module.exports = { getContacts, createContact, updateContact, updateAvatar, deleteContact };