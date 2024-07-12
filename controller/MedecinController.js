'use strict';

const { notify } = require(__dirname +"/NotificationController");

const Medecin = require(__dirname +'/../model/Medecin');
const Delegue = require(__dirname +'/../model/Delegue');

const getAllMedecins = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const user = await Delegue.findOne({ 
                where: { username: req.params.username },
                attributes: ['_id']
            });
            const resultats = await Medecin.findAll({
                where: {
                    assignedTo: user._id,
                    deleted: false
                }
            });
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOneMedecin = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await Medecin.findOne({
                where: {
                    _id: req.params.id,
                    username: req.params.username
                }
            });
            if (!resultats) {
                return res.status(404).json({ success: false, message: 'Medecin not found' });
            }
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addMedecin = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const medecin = await Medecin.create({ ...req.body });
            notify({
                title: "Succès",
                message: `Médecin ${medecin.nom} ${medecin.prenom} a été ajouté avec succès.`,
                recipient: req.decoded.username,
                type: "success"
            });
            res.status(200).json(medecin);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du médecin. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMedecin = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const [rowsUpdated, [updatedMedecin]] = await Medecin.update(req.body, {
                where: { _id: req.params.id },
                returning: true
            });
            if (!updatedMedecin) {
                return res.status(404).json({ success: false, message: 'Medecin not found' });
            }
            notify({
                title: "Succès",
                message: `Médecin ${updatedMedecin.nom} ${updatedMedecin.prenom} a été modifié avec succès.`,
                recipient: req.decoded.username,
                type: "success"
            });
            res.status(200).json(updatedMedecin);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du médecin. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMedecin = async (req, res) => {
    try {
        const deletedMedecin = await Medecin.update(
            { deleted: true },
            { where: { _id: req.params.id }, returning: true }
        );
        if (!deletedMedecin[1][0]) {
            return res.status(404).json({ success: false, message: 'Medecin not found' });
        }
        notify({
            title: "Succès",
            message: `Médecin ${deletedMedecin[1][0].nom} ${deletedMedecin[1][0].prenom} a été supprimé avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });
        res.status(200).json(deletedMedecin[1][0]);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la suppression du médecin. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllMedecins,
    getOneMedecin,
    addMedecin,
    updateMedecin,
    deleteMedecin
};
