process.env.TZ = 'Indian/Antananarivo';

require('module-alias/register');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const app = express();
const router = express.Router();
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// ++++++++++++++++++++++++++ MIDDLEWARES +++++++++++++++++++++++++++++
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

// Crée des logs
app.use(morgan('dev'));

// Configure le serveur pour servir des fichiers statiques
app.use(express.static('public'));

// ++++++++++++++++++++++++++ DATABASE ++++++++++++++++++++++++++
const connectToDatabase = require("./config/database");
connectToDatabase();

// ++++++++++++++++++++++++++ ROUTES ++++++++++++++++++++++++++
const baseRoutes = require("./routes/base.routes");
const roleRoutes = require("./routes/role.routes");
const userRoutes = require("./routes/user.routes");
const userTokenRoutes = require("./routes/userToken.routes");
const serviceRoutes = require("./routes/service.routes");
const clientRoutes = require("./routes/client.routes");
const managerRoutes = require("./routes/manager.routes");
const employeRoutes = require("./routes/employe.routes");
const rendezvousRoutes = require("./routes/rendezvous.routes");
const statutRoutes = require("./routes/statut.routes");
const tacheRoutes = require("./routes/tache.routes");
const offreRoutes = require("./routes/offre.routes");
const statistiqueRoutes = require("./routes/statistique.routes");

app.use("/", baseRoutes);
app.use("/Role", roleRoutes);
app.use("/User", userRoutes);
app.use("/UserToken", userTokenRoutes);
app.use("/Service", serviceRoutes);
app.use("/Client", clientRoutes);
app.use("/Manager", managerRoutes);
app.use("/Employe", employeRoutes);
app.use("/Rendezvous", rendezvousRoutes);
app.use("/Statut", statutRoutes);
app.use("/Tache", tacheRoutes);
app.use("/Offre", offreRoutes);
app.use("/Statistique", statistiqueRoutes);

//  Gérer les paths introuvables
app.use((req, res)=>{
    console.log("Page introuvable");
    res.send({ status: 404, message: "Page introuvable" });
});

// ++++++++++++++++++++++++++ LAUNCH ++++++++++++++++++++++++++
app.listen(PORT,()=>{
    console.log(`server is up and running on port ${PORT}`);
})