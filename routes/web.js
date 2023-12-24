const express=require("express");
const { getAllCalendriers, getOneCalendrier, addCalendrier, updateCalendrier, deleteCalendrier } = require("../controller/CalendrierController");
const { getAllMedecins, getOneMedecin, addMedecin, updateMedecin, deleteMedecin } = require("../controller/medecinController");
const { getAllProduits, getOneProduit, addProduit, updateProduit, deleteProduit } = require("../controller/ProduitController");

const router=express.Router()

// calendar ================================
router.get('/calendriers/:username', getAllCalendriers);
router.get('/calendriers/:username/:id', getOneCalendrier);
router.post('/calendriers/:username', addCalendrier);
router.put('/calendriers/:username/:id', updateCalendrier);
router.delete('/calendriers/:username/:id', deleteCalendrier);
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




module.exports=router