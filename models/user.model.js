const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
    }
});

userSchema.set("timestamps", true); // ajoute created_at et upated_at
const Userdb = mongoose.model("user", userSchema);
module.exports = Userdb;
