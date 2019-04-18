const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ImageSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  path: {
    type:String,
    required:true
  }
});

module.exports = Image = mongoose.model('Image', ImageSchema);