var mongoose = require('mongoose');
var {createConnection,exitConnection} = require('../mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
    token : {
        type: String,
        required: true
    },
    user_id : {
        type: ObjectId,
        required: true
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

schema.pre('save', function (next) {
    let now = Date.now();
    this.updated_at = now;
    if (!this.createdAt) {
        this.created_at = now;
    }
    next();    
});

schema.statics.create = function (data) { 
    return new Promise((resolve,reject) => {

        var newObj = new this({
            user_id : data.user_id,
            token : data.token            
        });

        createConnection().then((data) => {
            newObj.save().then((doc)=> {
                exitConnection();
                resolve(doc);
            },(err) => {
                exitConnection();
                reject(err);
            });
        }).catch((err)=>{
            reject(err);
        });
    });
};

module.exports = ('AccountVerification',mongoose.model('AccountVerification',schema));