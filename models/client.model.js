const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "service",
    },
    employe: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "employe",
    }
});

const clientSchema = new mongoose.Schema({
    nomClient: {
        type: String,
        required: true,
    },
    prenomClient: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    historiqueRDV: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "rendezvous",
    },
    image: {
        type: String,
        default: "default.webp",
    },
    preference: {
        type: preferenceSchema,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

clientSchema.set("timestamps", true); // ajoute created_at et upated_at
const Clientdb = mongoose.model("client", clientSchema);
module.exports = Clientdb;
