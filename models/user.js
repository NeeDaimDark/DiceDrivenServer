import mongoose from "mongoose";
import Joi from 'joi';

// Utilize schema and model from the mongoose module
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        goldCoins: {
            type: Number,
            default: 0
        },
        shields: {
            type: Number,
            default: 0
        },
        diceRolls: {
            type: Number,
            default: 0
        },
        couronnes: {  // New attribute added
            type: Number,
            default: 0
        },
        trailPoints: {  // New attribute for trail points
            type: Number,
            default: 0
        },
        petFood: {  // New attribute
            type: Number,
            default: 0
        },
        chest: {  // New attribute
            type: Number,
            default: 0
        },
        eventsId: {  // Reference to the Events model
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Events',
            default: null
        },
        villageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Village'
        },
        profilePic: {
            type: String,
            default: null
        },
        passwordUpdated: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export function userValidate(user) {
    const schema = Joi.object({
        username: Joi.string().min(4).max(25).required(),
        password: Joi.string().min(5).required(), // Ensure password is validated and passed correctly
    });

    return schema.validate(user);
}


export function loginValidate(user) {
    const schema = Joi.object({
        username: Joi.string().min(4).max(25).required(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(user);
}

export default model("User", userSchema);
