import User, { loginValidate, userValidate } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Village from '../models/village.js';
import Events from '../models/events.js';

import path from 'path';

// Check if user exists
export async function checkUserExists(req, res) {
    const { username } = req.query;

    try {
        const user = await User.findOne({ username });
        res.status(200).send(!!user); // Send "true" if user exists, "false" otherwise
    } catch (err) {
        res.status(500).send('Server error');
    }
}

export async function getAll(req, res) {
    try {
        const users = await User.find({}).lean();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getAllusr(req, res) {
    res.send({ users: await User.find() });
}

export async function profile(req, res) {
    try {
        const { _id } = req.user;
        const connectedUser = await User.findById(_id).lean();
        res.status(200).json(connectedUser);
    } catch (err) {
        res.status(401).json({ "message": "Authentication problem" });
    }
}

// Register
// Register
export async function register(req, res) {
    const { error } = userValidate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        let user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(404).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const { username } = req.body;

        // Create new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            goldCoins: 0,
            shields: 0,
            diceRolls: 0,
            couronnes: 0,
            trailPoints: 0,
            petFood: 0,
            chest: 0,
            profilePic: req.file ? `/uploads/images/${req.file.filename}` : null
        });

        // Create the associated village
        const newVillage = await Village.create({
            userId: newUser._id,
            level: 1,
            level_building1: -1,
            level_building2: -1,
            level_building3: -1,
            level_building4: -1,
            level_building5: -1,
            building1Attacked: false,
            building2Attacked: false,
            building3Attacked: false,
            building4Attacked: false,
            building5Attacked: false
        });

        // Create the associated events
        const newEvent = await Events.create({
            pawnPosition: 0,  // Start at position 1
            pourcentage: 0,   // Start at 1% (minimum allowed value)
            petLevel: 1,      // Initial pet level
            progress: 0,      // Initial progress
            userId: newUser._id
        });

        newUser.villageId = newVillage._id;
        newUser.eventsId = newEvent._id;
        await newUser.save();

        res.status(200).json({ message: 'User, Village, and Events created successfully!', user: newUser, village: newVillage, events: newEvent });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('Server error');
    }
}

export async function login(req, res) {
    const { error } = loginValidate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        let user = await User.findOne({ username: req.body.username }).populate('villageId').populate('eventsId');
        if (!user) {
            return res.status(404).send('Invalid username or password');
        }

        const checkPassword = await bcrypt.compare(req.body.password, user.password);
        if (!checkPassword) {
            return res.status(404).send('Invalid username or password');
        }

        const token = jwt.sign({ _id: user._id }, 'privateKey');

        res.header('x-auth-token', token).status(200).send({
            token: token,
            user: {
                id: user._id,
                username: user.username,
                goldCoins: user.goldCoins,
                shields: user.shields,
                diceRolls: user.diceRolls,
                couronnes: user.couronnes,
                trailPoints: user.trailPoints,
                petFood: user.petFood,
                chest: user.chest,
                profilePic: user.profilePic
            },
            village: user.villageId,
            events: user.eventsId  // Return event data as well
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}



// Update Profile
export async function updateUserbyuserId(req, res) {
    const { userId } = req.params;
    const { username, password, goldCoins, shields, diceRolls } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId, // Find the user by MongoDB-generated ID
            { $set: { username, password: await bcrypt.hash(password, 10), goldCoins, shields, diceRolls } }, // Update user's information
            { new: true } // Return the updated user
        );

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}

// Delete User
export async function deleteOnce(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the associated village and events
        await Village.findByIdAndRemove(user.villageId);
        await Events.findByIdAndRemove(user.eventsId);

        // Delete the user
        await User.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: "User, associated village, and events deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateUserbyUserId(req, res) {
    const { userId } = req.params;
    const updateFields = req.body;

    // Include trailPoints in the updateFields if it exists in the request body
    if (req.body.trailPoints !== undefined) {
        updateFields.trailPoints = req.body.trailPoints;
    }

    // Handle profile picture update if present
    if (req.file) {
        updateFields.profilePic = `/uploads/images/${req.file.filename}`;
    }

    try {
        // Handle password update if needed
        if (updateFields.password && updateFields.password !== "00000000") {
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
            updateFields.passwordUpdated = true;
        }

        // Update the user in the database
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }  // Return the updated user document
        );

        if (!user) {
            return res.status(404).json({ error: `User with ID ${userId} not found` });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }


}
export async function updateAttackRewards(req, res) {
    const { userId, goldCoins, trailPoints } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's goldCoins and trailPoints
        user.goldCoins += goldCoins;
        user.trailPoints += trailPoints;

        await user.save();

        return res.status(200).json({ message: 'Attack rewards updated successfully', user });
    } catch (error) {
        console.error('Error updating attack rewards:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}