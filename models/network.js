const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    // delete ret.__v;
  }
};

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getProfileData = function(slug){
    const query = {};
    query["profile_slug"] = slug;
    // 'profile_slug': slug
    return Promise.all([
      User.findOne(query)
      .then( data => ({ data: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );      
}

module.exports.getUserList = (pageSize, skip, sortby, orderby, query)=>{
  
    console.log("limit- "+pageSize);
    console.log("skip- "+skip);
    console.log("sort- "+sortby);
    console.log("order- "+orderby);
    console.log("query- "+JSON.stringify(query));

    return Promise.all([
      User.count().then(count => ({ total: count })),
      User.count(query).then(count => ({ searched_total: count })),
      User.find(query)
        .sort([[sortby, orderby]])
        .skip(skip > 0 ? (skip+1) : 0)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    

}

module.exports.deleteUserById = (req)=>{
  id = req.query.userID;
  User.findByIdAndRemove(id, function (err, res){
    if(err) { throw err; }
    if( res.result.n === 0 ) { console.log("Record not found"); }
    console.log("Deleted successfully.");
  });
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
