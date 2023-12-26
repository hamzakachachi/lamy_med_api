'use strict';
const express=require("express");
const { getAllCalendriers, getOneCalendrier, addCalendrier, updateCalendrier, deleteCalendrier, addMultiCalendriers, updateCalendrierDate } = require("../controller/CalendrierController");
const { getAllMedecins, getOneMedecin, addMedecin, updateMedecin, deleteMedecin } = require("../controller/medecinController");
const { getAllProduits, getOneProduit, addProduit, updateProduit, deleteProduit } = require("../controller/ProduitController");
const { getMyInfos } = require("../controller/userController");

const router=express.Router()

// calendar ================================
router.get('/calendriers/:username', getAllCalendriers);
router.get('/calendriers/:username/:id', getOneCalendrier);
router.post('/calendriers/:username', addCalendrier);
router.put('/calendriers/:username/:id', updateCalendrier);
router.put('/calendriers/changedate/:username/:id', updateCalendrierDate);
router.delete('/calendriers/:username/:id', deleteCalendrier);
router.post('/calendriers/many/:username', addMultiCalendriers);
// medecin =======================
router.get('/medecins/:username', getAllMedecins);
router.get('/medecins/:username/:id', getOneMedecin);
router.post('/medecins/:username', addMedecin);
router.put('/medecins/:username/:id', updateMedecin);
router.delete('/medecins/:username/:id', deleteMedecin);
// produit ==================================
router.get('/produits/:username', getAllProduits);
router.get('/produits/:username/:id', getOneProduit);
router.post('/produits/:username', addProduit);
router.put('/produits/:username/:id', updateProduit);
router.delete('/produits/:username/:id', deleteProduit);
// user ============
router.get('/account/:username', getMyInfos);





module.exports=router