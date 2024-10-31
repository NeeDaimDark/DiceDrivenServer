import mongoose from "mongoose";

const { Schema, model } = mongoose;

const villageSchema = new Schema(
    {
        level: {
            type: Number,
            default: 1, // Initial level is 1
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // The village must belong to a user
        },
        level_building1: {
            type: Number,
            default: -1,
            validate: {
                validator: function (level) {
                    return level >= -1 && level <= 4;
                },
                message: "Building level must be between -1 and 4",
            },
        },
        level_building2: {
            type: Number,
            default: -1,
            validate: {
                validator: function (level) {
                    return level >= -1 && level <= 4;
                },
                message: "Building level must be between -1 and 4",
            },
        },
        level_building3: {
            type: Number,
            default: -1,
            validate: {
                validator: function (level) {
                    return level >= -1 && level <= 4;
                },
                message: "Building level must be between -1 and 4",
            },
        },
        level_building4: {
            type: Number,
            default: -1,
            validate: {
                validator: function (level) {
                    return level >= -1 && level <= 4;
                },
                message: "Building level must be between -1 and 4",
            },
        },
        level_building5: {
            type: Number,
            default: -1,
            validate: {
                validator: function (level) {
                    return level >= -1 && level <= 4;
                },
                message: "Building level must be between -1 and 4",
            },
        },
        building1Attacked: { type: Boolean, default: false }, // New field for tracking attack status
        building2Attacked: { type: Boolean, default: false },
        building3Attacked: { type: Boolean, default: false },
        building4Attacked: { type: Boolean, default: false },
        building5Attacked: { type: Boolean, default: false },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

export default model("Village", villageSchema);
