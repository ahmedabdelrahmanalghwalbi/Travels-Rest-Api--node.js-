const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:[true,"user must have a name"]
    },
    email: {
        type: String,
        trim:true,
        unique: true,
        lowercase: true,
        required: [true,"user must have an email"],
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    photo: String,
    password: {
        type: String,
        required: [true, "user must have password"],
        //select:false
    },
    role: {
        type: String,
        enum: ["user", "admin","lead-guide", "guide"],
        default:"user"
    },
    active: {
        type: Boolean,
        default:false
    }
});

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model('User', userSchema);