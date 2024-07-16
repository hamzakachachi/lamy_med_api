'use strict';
const  Produit  = require('../model/Produit'); // Assuming your Sequelize model is correctly defined and exported
const { notify } = require('./NotificationController');

const getAllProduits = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await Produit.findAll({
                where: {
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

const getOneProduit = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await Produit.findByPk(req.params.id);
            if (!resultats) {
                return res.status(404).json({ success: false, message: 'Produit not found' });
            }
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addProduit = async (req, res) => {
    try {
        const produit = await Produit.create({ ...req.body });
        
        notify({
            title: "Succès",
            message: `Produit ${produit.intitule} a été ajouté avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });
        
        res.status(200).json(produit);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

const addManyProduit = async (req, res) => {
    try {
        const resultats = await Produit.bulkCreate(req.body.produits);
        
        notify({
            title: "Succès",
            message: `${resultats.length} produits ont été ajoutés avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(resultats);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout des Produits. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProduit = async (req, res) => {
    try {
        const rowsUpdated = await Produit.update(req.body, {
            where: { id: req.params.id }
        });

        // Check if any rows were updated
        if (rowsUpdated[0] === 0) {
            return res.status(404).json({ success: false, message: 'Produit not found' });
        }

        // Fetch the updated record
        const updatedProduit = await Produit.findByPk(req.params.id);

        notify({
            title: "Succès",
            message: `Produit ${updatedProduit.intitule} a été modifié avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        // console.log(updatedProduit);
        res.status(200).json(updatedProduit);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        // console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProduit = async (req, res) => {
    try {
        // Update the 'deleted' field to true
        const rowsUpdated = await Produit.update(
            { deleted: true },
            { where: { id: req.params.id } }
        );
        
        // Check if any rows were updated
        if (rowsUpdated[0] === 0) {
            return res.status(404).json({ success: false, message: 'Produit not found' });
        }

        // Fetch the updated record
        const deletedProduit = await Produit.findByPk(req.params.id);

        notify({
            title: "Succès",
            message: `Produit ${deletedProduit.intitule} a été supprimé avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(deletedProduit);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la suppression du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllProduits,
    getOneProduit,
    addProduit,
    updateProduit,
    deleteProduit,
    addManyProduit
};
