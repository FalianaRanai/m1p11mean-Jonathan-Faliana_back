const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/tache.controller");

router.get("/getTache/:id", TacheController.getTache);
router.get("/getListeTache", TacheController.getListeTache);
router.get("/getTacheByEmpToday/:id", TacheController.getTacheByEmpToday);
router.get("/getTacheByEmp/:id", TacheController.getTacheByEmp);
router.get("/getReservationParMois", TacheController.getReservationParMois);
router.post("/addTache", TacheController.addTache);
router.post("/getReservationParJour", TacheController.getReservationParJour);
router.put("/updateTache/:id", TacheController.updateTache);
router.post("/updateTaches/:token", TacheController.updateTaches)
router.delete("/deleteTache/:id", TacheController.deleteTache);

module.exports = router;