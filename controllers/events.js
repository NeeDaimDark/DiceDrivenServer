import Events from '../models/events.js';

export async function getEventByUserId(req, res) {
    try {
        const events = await Events.findOne({ userId: req.params.userId });
        if (!events) {
            return res.status(404).json({ message: "Events not found" });
        }
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateEventByUserId(req, res) {
    const { userId } = req.params;
    const updateFields = req.body; // pawnPosition, pourcentage

    try {
        const events = await Events.findOneAndUpdate({ userId }, { $set: updateFields }, { new: true });

        if (!events) {
            return res.status(404).json({ message: "Events not found" });
        }
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export async function deleteEventByUserId(req, res) {
    try {
        const events = await Events.findOneAndRemove({ userId: req.params.userId });
        if (!events) {
            return res.status(404).json({ message: "Events not found" });
        }
        res.status(200).json({ message: "Events deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}
