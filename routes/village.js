import express from 'express';
import { createVillage, getVillage, getVillageByUserId, updateVillage, updateVillageByUserId, deleteVillage, getAllVillages, attackBuilding} from '../controllers/village.js';

const router = express.Router();

// Create a new village
router.route('/').post(createVillage);

// Get all villages
router.route('/').get(getAllVillages);

// Get a village by village ID
router.route('/:id').get(getVillage);

// New route to get a village by user ID
router.route('/user/:userId').get(getVillageByUserId);

// New route to update a village by user ID
router.route('/user/:userId').put(updateVillageByUserId);

// Update a village by village ID
router.route('/:id').put(updateVillage);
// Attack a specific building in a village by building index
router.route('/user/:userId/building/:buildingIndex/attack').put(attackBuilding);


// Delete a village by ID
router.route('/:id').delete(deleteVillage);

export default router;
