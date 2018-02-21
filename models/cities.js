const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Cities Schema
const CitiesSchema = mongoose.Schema({

  name: { type: String, required: true, unique: true, index: true },
  slug: { type: String, slug: "name", slug_padding_size: 2, unique: true, index: true },
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

// const cities = module.exports = mongoose.model('Cities', CitiesSchema);

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, CitiesSchema);
  }
  return establishedModels[name];
}
const collection = 'cities';


module.exports.getCityList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let cities = createModelForName(db_name); // Create the db model.

  // console.log("limit- "+pageSize);
  // console.log("skip- "+skip);
  // console.log("sort- "+sortby);
  // console.log("order- "+orderby);
  // console.log("query- "+JSON.stringify(query));

  return Promise.all([
    cities.count().then(count => ({ total: count })),
    cities.count(query).then(count => ({ searched_total: count })),
    cities.find(query, { _id: 0 })
      .sort([[sortby, orderby]])
      .skip(skip)
      .limit(pageSize)
      .then(data => ({ rows: data }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {})
  );
}

module.exports.checkCityNameExists = (name, slug, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let cities = createModelForName(db_name); // Create the db model.
  // console.log('model -',name);
  // console.log('model -',slug);
  // city_id = ObjectId(city_id);

  let query = {};
  if (name) query['name'] = name;
  if (slug) query['slug'] = { $ne: slug };
  // console.log('query', query);
  return cities.count(query)
    .then(count => ({ success: true, name: count }))
    .catch(err => ({ success: false, error: err }));

  // return Promise.all([
  //   cities.count({"name": name, "_id": {$ne: city_id}}).then(count => ({ name: count })),
  //   cities.count({"slug": slug, "_id": {$ne: city_id}}).then(count => ({ slug: count }))
  // ]).then(result => result.reduce((acc,curr) =>
  //   Object.assign(acc,curr),{})
  // );
}

module.exports.createNewCity = function (cityData, db_slug) {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let cities = createModelForName(db_name); // Create the db model.

  var data = new cities(cityData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: item }))
    .catch(err => ({ success: false, msg: "unable to save to database", data: err }));
}

module.exports.updateCity = (cityData, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let cities = createModelForName(db_name); // Create the db model.

  // console.log('form data -',cityData);

  let query = { "slug": cityData.slug };
  let data = {
    name: cityData.name,
    description: cityData.description,
    status: cityData.status
  }
  return new Promise((resolve, reject) => {
    cities.findOneAndUpdate(query, data, { new: true }, function (err, city) {
      // console.log('on error', err);
      if (err) return reject(err);
      // console.log('db data 1', city);
      if (!city) return reject('Unable to find.');

      return resolve(city);
    })
  }).then(item => ({ success: true, msg: "City updated successfully.", data: item }))
    .catch(err => ({ success: false, msg: "Unable to update", data: err }));

}

module.exports.deleteCity = (slug, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let cities = createModelForName(db_name);

  return new Promise((resolve, reject) => {
    cities.findOneAndRemove({ slug: slug }, (err, city) => {
      // console.log('on error', err);
      if (err) return reject(err);
      // console.log('db data 1', city);
      if (!city) return reject('Unable to find.');

      return resolve(city);
    })
  }).then(item => ({ success: true, msg: 'City deleted.' }))
    .catch(err => ({ success: false, msg: 'Unable to delete.', data: err }));
}
