const mongoose = require("mongoose");

const rendezvousSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "client"
    },
    dateDebutRdv: {
        type: Date,
        required: true
    },
    dateFinRdv: {
        type: Date,
        required: true
    },
    listeTaches:{
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "tache"
    },
    paiement: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "paiement"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

rendezvousSchema.set("timestamps", true); // ajoute created_at et upated_at
const Rendezvousdb = mongoose.model("rendezvous", rendezvousSchema);
module.exports = Rendezvousdb;
