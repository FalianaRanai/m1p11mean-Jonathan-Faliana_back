const express = require("express");
const router = express.Router();
const StatutController = require("@controllers/statut.controller");

router.get("/getStatut/:id", StatutController.getStatut);
router.get("/getListeStatut", StatutController.getListeStatut);
router.post("/addStatut", StatutController.addStatut);
router.put("/updateStatut/:id", StatutController.updateStatut);
router.delete("/deleteStatut/:id", StatutController.deleteStatut);

module.exports = router;