const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
// User Schema
const EventSchema = mongoose.Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "title", slug_padding_size: 4, unique: true },
  posted_on: { type: Date, default: Date.now },
  category: { type: Number, default: 0 },       // 0=normal, 1=Institute event, 2=Alumni meet
  tag_line: { type: String, default: '' },
  positions: { type: Number, default: 1 },
  fees: { type: Number, default: 0 },
  start_date: { type: Date, default: Date.now },
  start_time: { type: Date, default: '' },
  end_date: { type: Date, default: Date.now },
  end_time: { type: Date, default: '' },
  location: { type: String, default: '' },
  images: { type: Array, "default": [] },
  
  posted_by: {
    user_id:      { type: String, required: true },
    name:         { type: String, required: true },
    profile_line: { type: String, default: '' },
    profile_pic:  { type: String, default: '' },
    batch:        { type: Number, default: '' },
    course:       { type: String, default: '' },
    gender:       { type: Number, default: 3 }   // 1= Male, 2= Femail, 3= Other
  },
  application_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },
  tag: { type: Array, "default": [] },
  publish: { type: Boolean, default: true }   // true , false
});

EventSchema.index({ title: 'text' });
const event = module.exports = mongoose.model('event', EventSchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.saveEvent = function(eventData){
  var data = new event(eventData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.changeState = (slug, state)=>{
  return event.update({"slug": slug}, { $set: {"publish": state }})
      .then(item => ({ success: true, msg: 'Updated successfully' }))
      .catch(err => ({ success: false, msg: 'Unable to process'}));
}

module.exports.deleteEvent = (slug)=>{
  return event.find({"slug": slug}).remove()
      .then(item => ({ success: true, msg: 'Deleted successfully' }))
      .catch(err => ({ success: false, msg: 'Unable to process'}));
}

module.exports.editEvent = (eventData)=>{
    console.log('model -',eventData);
    // return Promise.all([
      return event.findById(eventData._id)
      .then(event => {
        console.log('in then', event);
        event.name = eventData.name;
        event.slug = eventData.slug;
        event.description = (eventData.description==='')?'':eventData.description;
        event.image = (eventData.image==='')?event.image:eventData.image;
        event.event = eventData.event;

        return event.save()
        .then(item => ({ success: true, msg: "Item saved", data: event }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
    // ]).then(result => result.reduce((acc,curr) =>
    //   Object.assign(acc,curr),{})
    // );
}

module.exports.getEventList = (pageSize, skip, sortby, orderby, query)=>{
  
    // console.log("limit- "+pageSize);
    // console.log("skip- "+skip);
    // console.log("sort- "+sortby);
    // console.log("order- "+orderby);
    // console.log("query- "+JSON.stringify(query));

    return Promise.all([
      event.count().then(count => ({ total: count })),
      event.count(query).then(count => ({ searched_total: count })),
      event.find(query)
        .sort([[sortby, orderby]])
        .skip(skip)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    
}
