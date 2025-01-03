var express = require('express');
const { getContacts, createContact, updateContact, deleteContact, updateAvatar, getContactById } = require('../controllers/phonebook');
var router = express.Router();

/* GET users listing. */
router.get('/phonebooks', async function (req, res, next) {//get contacts
    try {
        const response = await getContacts(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/phonebooks/:id', async function (req, res, next) {
    try {
        const response = await getContactById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/phonebooks', async function (req, res, next) {//insert contacts
    try {
        const response = await createContact(req.body);
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/phonebooks/:id', async function (req, res, next) {//edit contacts
    try {
        const response = await updateContact({ ...req.body, id: req.params.id });
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/phonebooks/:id/avatar', async function (req, res, next) {//edit avatar
    try {
        if (!req.files) res.status(400).json({ message: 'no image files were uploaded' })
        else {
            const response = await updateAvatar({ file: req.files, id: req.params.id });
            res.status(201).json(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


router.delete('/phonebooks/:id', async function (req, res, next) {//delete contacts
    try {
        const response = await deleteContact(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
