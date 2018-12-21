var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
var {createConnection,exitConnection} = require('../db/mongoose');

const salt = bcrypt.genSaltSync();

var userSchema = new mongoose.Schema({

    first_name : {
        type: String,
        required: true,
        trim: true
    },
    last_name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

userSchema.virtual('full_name').set(function(name) {
    let str = name.split(' ');
    this.first_name = str[0];
    this.last_name = str[1];
});

userSchema.pre('save', function (next) {
    let now = Date.now();
    this.updated_at = now;
    if (!this.createdAt) {
        this.created_at = now;
    }
    next();    
});

userSchema.statics.create = function (user) { 
    return new Promise((resolve,reject) => {
        
        createConnection();
        
        var newUser = new this({
            full_name : user.full_name,
            email : user.email,
            password : bcrypt.hashSync(user.password, salt)            
        });
        
        newUser.save().then((doc)=> {
            exitConnection();
            resolve(doc);
        },(err) => {
            exitConnection();
            reject(err);
        });
    });
};

userSchema.statics.validatePassword = function (password) {
    return new Promise((resolve,reject) => {
        if(bcrypt.compareSync(password, this.password)) {
            resolve(1);
        } else {
            reject(0);
        }
    });
}

module.exports = ('User', mongoose.model('users',userSchema));
