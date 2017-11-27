const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');

// User Schema
const CitiesSchema = mongoose.Schema({

  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '/assets/build/images/city.jpg' },
  connections_total: { type: Number, default: 0 },
  connections: [{
    user_id:      { type: String, default: '' },
    name:         { type: String, default: '' },
    profile_line: { type: String, default: '' },
    profile_pic:  { type: String, default: '' },
    batch:        { type: Number, default: '' },
    course:       { type: String, default: '' },
    gender:       { type: Number }
  }],
  status: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }

});

const cities = module.exports = mongoose.model('Cities', CitiesSchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.createNewCity = function(cityData){
  var data = new cities(cityData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.checkCityNameExists = (name, slug, city_id)=>{
  // console.log('model -',name);
  // console.log('model -',slug);
  city_id = ObjectId(city_id);
  return Promise.all([
    cities.count({"name": name, "_id": {$ne: city_id}}).then(count => ({ name: count })),
    cities.count({"slug": slug, "_id": {$ne: city_id}}).then(count => ({ slug: count }))
  ]).then(result => result.reduce((acc,curr) =>
    Object.assign(acc,curr),{})
  );
}

module.exports.savecity = (cityData)=>{
    console.log('model -',cityData);
    // return Promise.all([
      return cities.findById(cityData._id)
      .then(city => {
        console.log('in then', city);
        city.name = cityData.name;
        city.slug = cityData.slug;
        city.description = (cityData.description==='')?'':cityData.description;
        city.image = (cityData.image==='')?city.image:cityData.image;
        city.status = cityData.status;

        return city.save()
        .then(item => ({ success: true, msg: "Item saved", data: city }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
    // ]).then(result => result.reduce((acc,curr) =>
    //   Object.assign(acc,curr),{})
    // );
}

module.exports.getCityList = (pageSize, skip, sortby, orderby, query)=>{
  
    // console.log("limit- "+pageSize);
    // console.log("skip- "+skip);
    // console.log("sort- "+sortby);
    // console.log("order- "+orderby);
    // console.log("query- "+JSON.stringify(query));

    return Promise.all([
      cities.count().then(count => ({ total: count })),
      cities.count(query).then(count => ({ searched_total: count })),
      cities.find(query)
        .sort([[sortby, orderby]])
        .skip(skip)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    
}

// module.exports.deleteUserById = (req)=>{
//   id = req.query.userID;
//   User.findByIdAndRemove(id, function (err, res){
//     if(err) { throw err; }
//     if( res.result.n === 0 ) { console.log("Record not found"); }
//     console.log("Deleted successfully.");
//   });
// }

// module.exports.addUser = function(newUser, callback){
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(newUser.password, salt, (err, hash) => {
//       if(err) throw err;
//       newUser.password = hash;
//       newUser.save(callback);
//     });
//   });
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
//   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
//     if(err) throw err;
//     callback(null, isMatch);
//   });
// }
