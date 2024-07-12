'use strict';
const Calendrier = require('../model/Calendrier'); // Assuming your Sequelize models are defined and exported correctly
const Delegue = require('../model/Delegue'); // Assuming your Sequelize models are defined and exported correctly
const { notify } = require('./NotificationController');
const bcrypt = require('bcrypt');

const getAllDelegues = async (req, res) => {
    try {
        const resultats = await Delegue.findAll({
            where: {
                username: { $ne: req.decoded.username },
                deleted: false
            },
            include: [{
                model: Calendrier,
                as: 'calendriers'
            }],
            attributes: {
                include: [
                    'id', 'nom', 'prenom', 'username', 'createdAt', 'updatedAt', 'lastActivities', 'status', 'role',
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegueId = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 0
                        )`),
                        'countStatus0'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegueId = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 1
                        )`),
                        'countStatus1'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegueId = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 2
                        )`),
                        'countStatus2'
                    ]
                ]
            },
            order: [['createdAt', 'DESC']]
        });
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
            include: [{
                model: Calendrier,
                as: 'calendriers'
            }],
            attributes: {
                include: [
                    'id', 'nom', 'prenom', 'username', 'createdAt', 'updatedAt', 'lastActivities', 'status', 'role',
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegueId = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 0
                        )`),
                        'countStatus0'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegueId = Delegue.id
                            AND calendrier.deleted = false
                            AND calendrier.status = 1
                        )`),
                        'countStatus1'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM calendriers AS calendrier
                            WHERE calendrier.delegueId = Delegue.id
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

        const resultats = await Delegue.findOneAndUpdate(
            { _id: req.params.id },
            updates,
            { new: true }
        );

        if (!resultats) {
            throw new Error('Délégué non trouvé');
        }

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
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const resultats = await Delegue.update(
            { deleted: true },
            { where: { id: req.params.id }, returning: true }
        );

        if (!resultats[1][0]) {
            throw new Error('Délégué non trouvé');
        }

        notify({
            title: "Succès",
            message: `Délégué ${resultats[1][0].nom} ${resultats[1][0].prenom} a été supprimé avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(resultats[1][0]);
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
