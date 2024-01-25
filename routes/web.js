'use strict';
const express=require("express");
const { checkPermission } = require("./permission");
const { getNotifications } = require(__dirname +"/../controller/NotificationController");
const { getAllCalendriers, getOneCalendrier, addCalendrier, updateCalendrier, deleteCalendrier, addMultiCalendriers, updateCalendrierDate } = require(__dirname +"/../controller/CalendrierController");
const { getAllMedecins, getOneMedecin, addMedecin, updateMedecin, deleteMedecin } = require(__dirname + "/../controller/MedecinController");
const { getAllProduits, getOneProduit, addProduit, updateProduit, deleteProduit, addManyProduit } = require(__dirname + "/../controller/ProduitController");
const { getMyInfos, addUser, deleteUser, updateUser, getAllDelegues } = require(__dirname +"/../controller/userController");

const router=express.Router()

// calendar ================================
router.get('/calendriers/:username', getAllCalendriers);
router.get('/calendriers/:username/:id', getOneCalendrier);
router.post('/calendriers/:username', addCalendrier);
router.put('/calendriers/:username/:id', updateCalendrier);
router.put('/calendriers/changedate/:username/:id', updateCalendrierDate);
router.delete('/calendriers/:id', deleteCalendrier);
router.post('/calendriers/many/:username', addMultiCalendriers);
// medecin =======================
router.get('/medecins/:username', getAllMedecins);
router.get('/medecins/:username/:id', getOneMedecin);
router.post('/medecins/:username', addMedecin);
router.put('/medecins/:username/:id', updateMedecin);
router.delete('/medecins/:id', deleteMedecin);
// produit ==================================
router.get('/produits/:username', getAllProduits);
router.get('/produits/:username/:id', getOneProduit);
router.post('/produits', checkPermission("admin"), addProduit);
router.post('/produits/many', checkPermission("admin"), addManyProduit);
router.put('/produits/:id', checkPermission("admin"), updateProduit);
router.delete('/produits/:id', checkPermission("admin"), deleteProduit);

// user =====================================
router.get('/account/:username', getMyInfos);
router.get('/delegues', checkPermission("admin"), getAllDelegues);
router.post('/delegues', checkPermission("admin"), addUser);
router.put('/delegues/:id', checkPermission("admin"), updateUser);
router.delete('/delegues/:id', checkPermission("admin"), deleteUser);


// notifications ============================
router.get('/notifications/:username', getNotifications);





module.exports=router