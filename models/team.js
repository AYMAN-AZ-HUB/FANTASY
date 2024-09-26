import { Schema, Document, model } from "mongoose";

const teamSchema = new Schema({
    Captain: {
        type: String,
        required: true,
        max: 64
    },
    Player_1: {
        type: String,
        required: true,
        unique: true
    },
    Player_2: {
        type: String,
        required: true,
        unique: true
    },
    Player_3: {
        type: String,
        required: true,
        unique: true
    },
    Player_4: {
        type: String,
        required: true,
        unique: true
    },

});

const Team = model('Team', teamSchema);

export default Team;