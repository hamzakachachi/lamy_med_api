'use strict';
const ProduitModel = require(__dirname +'/../model/Produit');
const { notify } = require(__dirname +"/NotificationController");


const getAllProduits = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await ProduitModel.find({
                $or: [
                  { deleted: false },
                  { deleted: { $exists: false } }
                ]
            });
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const getOneProduit = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await ProduitModel.findOne({_id:req.params.id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}

const addProduit = async (req,res)=>{
    try {
        const Produit = new ProduitModel({...req.body});
        const resultats= await Produit.save();
            
        notify({
            title: "Succès",
            message: `Produit ${resultats.intitule} a été ajouté avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });
        res.status(200).json(resultats);
        
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(200).json({ success: false, message: error.message });
    }
    
}

const addManyProduit = async (req,res)=>{
    try {
        const resultats = await ProduitModel.insertMany([...req.body.produits]);
            
        notify({
            title: "Succès",
            message: `${resultats.insertedCount} produits ont été ajoutés avec succès.`,
            recipient: req.decoded.username,
            type: "success"
        });
        res.status(200).json(resultats);
        
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(200).json({ success: false, message: error.message });
    }
    
}

const updateProduit= async (req,res)=>{
    try {
        const resultats = await ProduitModel.findOneAndUpdate({_id:req.params.id},{$set:{...req.body}},{ new: true });
            
        notify({
            title: "Succès",
            message: `Produit ${resultats.intitule} a été modifié avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });
        res.status(200).json(resultats);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const deleteProduit = async (req, res) => {
    try {
        const resultats = await ProduitModel.findOneAndUpdate({ _id: req.params.id },{$set:{deleted : true}},{ new: true });
        notify({
            title: "Succès",
            message: `Produit ${resultats.intitule} a été supprimé avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });
        res.status(200).json(resultats);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la suppression du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(200).json({ success: false, message: error.message });
    }

}


module.exports={
    getAllProduits, getOneProduit, addProduit, updateProduit, deleteProduit, addManyProduit
}
