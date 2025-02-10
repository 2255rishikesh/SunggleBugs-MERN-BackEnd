const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const db  = require('../utils/mongoDBConnection');


// Fetch all categories
router.get('/', async (req, res) => {
    try {
        const categories = await db.get().collection('categories').find().toArray();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch category by ID
router.get('/:id', async (req, res) => {
    try {
      
        const category = await  db.get().collection('categories').findOne({ _id:new ObjectId(req.params.id) });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new category
router.post('/', async (req, res) => {
    try {
        
        const result = await  db.get().collection('categories').insertOne(req.body);
        res.status(201).json({message: "creatred succeffully"});  // Return the newly created category
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete category by ID
router.delete('/:id', async (req, res) => {
    try {
        
        const result = await  db.get().collection('categories').deleteOne({ _id:new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update category by ID
router.put('/:id', async (req, res) => {
    try {
        
        const result = await  db.get().collection('categories').updateOne(
            { _id:new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const updatedCategory = await db.collection('categories').findOne({ _id:new ObjectId(req.params.id) });
        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add an item to a category
router.post('/:categoryId/items', async (req, res) => {
    try {
       
        const category = await  db.get().collection('categories').findOne({ _id:new ObjectId(req.params.categoryId) });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const updatedCategory = await db.get().collection('categories').updateOne(
            { _id:new ObjectId(req.params.categoryId) },
            { $push: { items: req.body } }
        );
        res.status(201).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all items from a category
router.get('/:categoryId/items', async (req, res) => {
    try {
       
        const category = await  db.get().collection('categories').findOne({ _id:new ObjectId(req.params.categoryId) });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category.items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an item from a category
router.delete('/:categoryId/items/:itemId', async (req, res) => {
    try {
        
        const category = await  db.get().collection('categories').findOne({ _id:new ObjectId(req.params.categoryId) });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const updatedCategory = await db.get().collection('categories').updateOne(
            { _id:new ObjectId(req.params.categoryId) },
            { $pull: { items: { _id:new ObjectId(req.params.itemId) } } }
        );
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an item in a category
router.put('/:categoryId/items/:itemId', async (req, res) => {
    try {
        
        const category = await  db.get().collection('categories').findOne({ _id:new ObjectId(req.params.categoryId) });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedCategory = await db.get().collection('categories').updateOne(
            { _id:new ObjectId(req.params.categoryId), 'items._id':new ObjectId(req.params.itemId) },
            { $set: { 'items.$': req.body } }
        );

        if (updatedCategory.matchedCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific item in a category
router.get('/:categoryId/items/:itemId', async (req, res) => {
    try {
      
        const category = await  db.get().collection('categories').findOne({ _id:new ObjectId(req.params.categoryId) });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const item = category.items.find(item => item._id.toString() === req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
