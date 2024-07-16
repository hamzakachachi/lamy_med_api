'use strict';
const { Sequelize, Op } = require('sequelize');
const {Calendrier} = require('../model/Calendrier'); // Assuming your Sequelize models are defined and exported correctly
const Delegue = require('../model/Delegue'); // Assuming your Sequelize models are defined and exported correctly
const { notify } = require('./NotificationController');
const bcrypt = require('bcrypt');

const getAllDelegues = async (req, res) => {
    try {
        const resultats = await Delegue.findAll({
            where: {
                username: { [Op.ne]: req.decoded.username },
                deleted: false
            },
            // include: [{
            //     model: Calendrier,
            //     as: 'calendriers'
            // }],
            attributes: {
                exclude: ['password'],
                include: [
                    'id', 'nom', 'prenom', 'username', 'createdAt', 'updatedAt', 'lastActivities', 'status', 'role',
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 0
                        )`),
                        'countStatus0'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 1
                        )`),
                        'countStatus1'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 2
                        )`),
                        'countStatus2'
                    ]
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        // console.log(resultats);
        res.status(200).json(resultats);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyInfos = async (req, res) => {
    try {
        if (req.params.username === req.decoded.username) {
            const resultats = await Delegue.findOne({
                where: { username: req.params.username },
                attributes: { exclude: ['password'] }
            });
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

const addUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await Delegue.create({
            nom: req.body.nom,
            prenom: req.body.prenom,
            username: req.body.username,
            password: hashedPassword,
            status: req.body.status,
            role: req.body.role
        });

        const rep = await Delegue.findOne({
            where: { id: user.id },
            // include: [{
            //     model: Calendrier,
            //     as: 'calendriers'
            // }],
            attributes: {
                exclude: ['password'],
                include: [
                    'id', 'nom', 'prenom', 'username', 'createdAt', 'updatedAt', 'lastActivities', 'status', 'role',
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 0
                        )`),
                        'countStatus0'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 1
                        )`),
                        'countStatus1'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 2
                        )`),
                        'countStatus2'
                    ]
                ]
            }
        });

        notify({
            title: "Succès",
            message: `Délégué ${resultats.nom} ${resultats.prenom} a été ajouté avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(rep);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du Délégué. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }

}


const updateUser = async (req, res) => {
    try {
        const updates = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            status: req.body.status,
            role: req.body.role
        };

        if (req.body.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        const rowsUpdated = await Delegue.update(updates, {
            where: { id: req.params.id }
        });

        if (rowsUpdated[0] === 0) {
            return res.status(404).json({ success: false, message: 'Délégué non trouvé' });
        }

        const resultats = await Delegue.findOne({
            where: { id: req.params.id },
            // include: [{
            //     model: Calendrier,
            //     as: 'calendriers'
            // }],
            attributes: {
                exclude: ['password'],
                include: [
                    'id', 'nom', 'prenom', 'username', 'createdAt', 'updatedAt', 'lastActivities', 'status', 'role',
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 0
                        )`),
                        'countStatus0'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 1
                        )`),
                        'countStatus1'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegue = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 2
                        )`),
                        'countStatus2'
                    ]
                ]
            }
        });

        notify({
            title: "Succès",
            message: `Délégué ${resultats.nom} ${resultats.prenom} a été modifié avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(resultats);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du Délégué. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const rowsUpdated = await Delegue.update(
            { deleted: true },
            { where: { id: req.params.id } }
        );

        if (rowsUpdated[0] === 0) {
            return res.status(404).json({ success: false, message: 'Délégué non trouvé' });
        }

        const resultats = await Delegue.findByPk(req.params.id);

        notify({
            title: "Succès",
            message: `Délégué ${resultats.nom} ${resultats.prenom} a été supprimé avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(resultats);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la suppression du Délégué. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    getMyInfos,
    addUser,
    deleteUser,
    updateUser,
    getAllDelegues
};
