const router = require('express').Router();
const List = require('../models/List');
const { verifyToken } = require('../middleware/verifyToken');

// CREATE LIST
router.post('/', verifyToken, async (req, res) => {
  const newList = new List({ ...req.body, owner: req.user.id });
  try {
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER LISTS (Returns all lists of an authenticated user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const lists = await List.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});

// INITIALIZE SYSTEM LISTS (Favorites & Watchlist if they don't exist)
router.post('/init', verifyToken, async (req, res) => {
    try {
        const favList = await List.findOne({ owner: req.user.id, type: 'system_favorites' });
        if (!favList) {
            await new List({ title: 'Favorilerim', type: 'system_favorites', owner: req.user.id }).save();
        }
        const watchList = await List.findOne({ owner: req.user.id, type: 'system_watchlist' });
        if (!watchList) {
            await new List({ title: 'İzleme Listesi', type: 'system_watchlist', owner: req.user.id }).save();
        }
        res.status(200).json('System lists initialized');
    } catch(err) {
        res.status(500).json(err);
    }
});

// ADD ITEM TO SPECIFIC LIST
router.post('/:id/add', verifyToken, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, owner: req.user.id });
    if (!list) return res.status(404).json('List not found');

    if (!list.contentItems.find(item => item.movieId === req.body.movieId)) {
       list.contentItems.push(req.body);
       await list.save();
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REMOVE ITEM FROM LIST
router.delete('/:id/remove/:movieId', verifyToken, async (req, res) => {
    try {
        const list = await List.findOne({ _id: req.params.id, owner: req.user.id });
        if (!list) return res.status(404).json('List not found');
        
        list.contentItems = list.contentItems.filter(item => item.movieId !== req.params.movieId);
        await list.save();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE LIST (Only custom lists can be deleted)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedList = await List.findOneAndDelete({ _id: req.params.id, owner: req.user.id, type: 'custom' });
        if (!deletedList) return res.status(400).json('Belirtilen liste bulunamadı veya sistem listeleri silinemez.');
        res.status(200).json('Liste başarıyla silindi.');
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
