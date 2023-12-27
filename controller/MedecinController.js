'use strict';

const { notify } = require(__dirname +"/NotificationController");

const MedecinModel = require(__dirname +'/../model/Medecin');
const DelegueModel = require(__dirname +'/../model/Delegue');

const getAllMedecins = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const user = await DelegueModel.findOne({ username: req.params.username },{_id:1});
            const resultats = await MedecinModel.find({assignedTo: user._id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const getOneMedecin = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const resultats = await MedecinModel.findOne({username:req.params.username, _id:req.params.id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const addMedecin = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const Medecin = new MedecinModel({...req.body});
            const resultats= await Medecin.save();
            notify({
                title: "Succès",
                message: `Médecin ${resultats.nom} ${resultats.prenom} a été ajouté avec succés.`,
                recipient: req.params.username
            });
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du médecin. Veuillez réessayer.",
            recipient: req.params.username
          });
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const updateMedecin= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats= await MedecinModel.findOneAndUpdate({_id:req.params.id},{$set:{...req.body}},{ new: true });
            notify({
                title: "Succès",
                message: `Médecin ${resultats.nom} ${resultats.prenom} a été modifiée avec succés.`,
                recipient: req.params.username
            });
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modifification du médecin. Veuillez réessayer.",
            recipient: req.params.username
        });
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const deleteMedecin= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats=await MedecinModel.findOneAndDelete({username:req.params.username, _id:req.params.id});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


module.exports={
    getAllMedecins, getOneMedecin, addMedecin, updateMedecin, deleteMedecin
}
