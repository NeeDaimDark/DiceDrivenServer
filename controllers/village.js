

import Village from '../models/village.js';

export async function createVillage(req, res) {
    const {
        userId,
        level,
        level_building1,
        level_building2,
        level_building3,
        level_building4,
        level_building5,
        building1Attacked,   // New fields
        building2Attacked,
        building3Attacked,
        building4Attacked,
        building5Attacked
    } = req.body;

    try {
        const village = await Village.create({
            userId,
            level: level || 1,
            level_building1: level_building1 || -1,
            level_building2: level_building2 || -1,
            level_building3: level_building3 || -1,
            level_building4: level_building4 || -1,
            level_building5: level_building5 || -1,
            building1Attacked: building1Attacked || false,  // Default to false if not provided
            building2Attacked: building2Attacked || false,
            building3Attacked: building3Attacked || false,
            building4Attacked: building4Attacked || false,
            building5Attacked: building5Attacked || false
        });

        return res.status(200).json(village);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }
}



export async function getVillage(req, res) {
    try {
        const village = await Village.findById(req.params.id).populate('userId');
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }

        res.status(200).json(village);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// New function to get village by userId
export async function getVillageByUserId(req, res) {
    try {
        const village = await Village.findOne({ userId: req.params.userId }).populate('userId');
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }

        res.status(200).json(village);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// New function to update village by userId
export async function updateVillageByUserId(req, res) {
    try {
        const { userId } = req.params;
        const { level_building1, level_building2, level_building3, level_building4, level_building5, building1Attacked, building2Attacked, building3Attacked, building4Attacked, building5Attacked } = req.body;

        // Find the existing village data
        const village = await Village.findOne({ userId: userId });
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }

        // Update the building levels if the new level is defined and greater than the current level
        if (level_building1 !== undefined && level_building1 > village.level_building1) {
            village.level_building1 = level_building1;
        }
        if (level_building2 !== undefined && level_building2 > village.level_building2) {
            village.level_building2 = level_building2;
        }
        if (level_building3 !== undefined && level_building3 > village.level_building3) {
            village.level_building3 = level_building3;
        }
        if (level_building4 !== undefined && level_building4 > village.level_building4) {
            village.level_building4 = level_building4;
        }
        if (level_building5 !== undefined && level_building5 > village.level_building5) {
            village.level_building5 = level_building5;
        }

        // Update the attack status for each building
        if (building1Attacked !== undefined) {
            village.building1Attacked = building1Attacked;
        }
        if (building2Attacked !== undefined) {
            village.building2Attacked = building2Attacked;
        }
        if (building3Attacked !== undefined) {
            village.building3Attacked = building3Attacked;
        }
        if (building4Attacked !== undefined) {
            village.building4Attacked = building4Attacked;
        }
        if (building5Attacked !== undefined) {
            village.building5Attacked = building5Attacked;
        }

        // Check if all buildings are maxed out
        const allBuildingsMaxed = [
            village.level_building1,
            village.level_building2,
            village.level_building3,
            village.level_building4,
            village.level_building5,
        ].every((level) => level === 4);

        if (allBuildingsMaxed) {
            // If all buildings are at max level, increment the village level and reset buildings
            village.level += 1;
            village.level_building1 = -1;
            village.level_building2 = -1;
            village.level_building3 = -1;
            village.level_building4 = -1;
            village.level_building5 = -1;
            // Reset attacked status
            village.building1Attacked = false;
            village.building2Attacked = false;
            village.building3Attacked = false;
            village.building4Attacked = false;
            village.building5Attacked = false;
        }

        // Save the updated village data
        await village.save();

        res.status(200).json(village);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function getAllVillages(req, res) {
    try {
        const villages = await Village.find({}).populate('userId');
        res.status(200).json(villages);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateVillage(req, res) {
    try {
        const village = await Village.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }

        res.status(200).json(village);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function deleteVillage(req, res) {
    try {
        const village = await Village.findByIdAndRemove(req.params.id);
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }

        res.status(200).json({ message: "Village deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export const attackBuilding = async (req, res) => {
    const { userId, buildingIndex } = req.params; // buildingIndex: 1 to 5 for buildings
    try {
        const village = await Village.findOne({ userId });

        if (!village) {
            return res.status(404).json({ message: 'Village not found' });
        }

        // Update the attacked status and decrease building level
        let levelKey = `level_building${buildingIndex}`;
        let attackedKey = `building${buildingIndex}Attacked`;

        // Decrease level if it's greater than -1
        if (village[levelKey] > -1) {
            village[levelKey] = Math.max(village[levelKey] - 1, -1); // Ensure it doesn't go below -1
        }

        // Mark the building as attacked
        village[attackedKey] = true;

        await village.save();

        return res.status(200).json({ message: 'Building attacked successfully', village });
    } catch (error) {
        return res.status(500).json({ message: 'Error attacking building', error });
    }
};
