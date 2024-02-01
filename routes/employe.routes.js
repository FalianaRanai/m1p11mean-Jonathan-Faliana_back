const express = require("express");
const router = express.Router();
const EmployeController = require("@controllers/employe.controller");

router.get("/getEmploye/:id", EmployeController.getEmploye);
router.get("/getListeEmploye", EmployeController.getListeEmploye);
router.post("/addEmploye", EmployeController.addEmploye);
router.put("/updateEmploye/:id", EmployeController.updateEmploye);
router.delete("/deleteEmploye/:id", EmployeController.deleteEmploye);

module.exports = router;