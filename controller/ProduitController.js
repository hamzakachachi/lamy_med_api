'use strict';
const ProduitModel = require(__dirname +'/../model/Produit');


const getAllProduits = async (req,res)=>{
    console.log('====================================');
    console.log(req.params.username, "produits");
    console.log('====================================');
    try {
        if (req.decoded.username === req.params.username) {
            const resultats = await ProduitModel.find();
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const getOneProduit = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const resultats = await ProduitModel.findOne({id:req.params.id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const addProduit = async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const Produit = new ProduitModel({...req.body});
            const resultats= await Produit.save();
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const updateProduit= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats= await ProduitModel.findOneAndUpdate({id:req.params.id},{...req.body});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const deleteProduit= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats=await ProduitModel.findOneAndDelete({ id:req.params.id});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


module.exports={
    getAllProduits, getOneProduit, addProduit, updateProduit, deleteProduit
}
