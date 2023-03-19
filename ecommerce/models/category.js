const mongoose = require('mongoose');

const categorySchemea = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        maxlength: 32
    },

}, { timestamps: true })

const Category = mongoose.model("Category", categorySchemea);
Category.createIndexes();
module.exports = Category;