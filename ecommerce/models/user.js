const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuidv1');

const userSchemea = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        maxlength: 32
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        maxlength: 32,
    },

    hashed_password: {
        type: String,
        required: true,
    },

    about: {
        type: String,
        trim: true,
    },

    salt: String,

    role: {
        type: Number,
        default: 0
    },

    history: {
        type: Array,
        default: []
    }
}, { timestamps: true })

// virtual fields
userSchemea.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    })

userSchemea.methods = {

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";

        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex")

        } catch (error) {
            return "";
        }
    }
}

const User = mongoose.model("User", userSchemea);
User.createIndexes();
module.exports = User;