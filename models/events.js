import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const eventSchema = new Schema(
    {
        pawnPosition: {
            type: Number,
            min: 0,
            max: 119,
            required: true,
        },
        pourcentage: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
        },
        petLevel: {
            type: Number,
            default: 1,
            required: true
        },
        progress: {
            type: Number,
            default: 0,  // Progress bar from 0 to 100
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model("Events", eventSchema);
