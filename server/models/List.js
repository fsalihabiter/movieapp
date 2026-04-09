const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['system_favorites', 'system_watchlist', 'custom'], 
    default: 'custom' 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  contentItems: [{
    movieId: { type: String, required: true },
    posterPath: { type: String },
    title: { type: String },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('List', ListSchema);
