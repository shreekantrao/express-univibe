const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');
// const config = require('../config/keys');
const fastCsv = require('fast-csv');
const fs = require('fs');

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
// User Schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  is_email_verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  temp_password: {
    type: String,
    default: ''
  },
  user_status: {
    type: Number,
    default: 1
  }, //1=pending, 2=approved, 3=rejected, 4=suspend
  user_type: {
    type: Number,
    default: 1
  }, //1=Student,  2=Alumni, 3=Faculty, 4=alcom, 5=collegeAdmin, 6=Administrator
  user_from: {
    type: Number,
    default: 1
  }, //1=registration, 2=byadmin, 3=import, 4=facebook, 5=linkedin, 6=google
  registered_on: {
    type: Date,
    default: Date.now
  },
  approved_on: {
    type: Date
  },
  approved_by_id: {
    type: String
  },
  approved_by_name: {
    type: String
  },
  activation_key: {
    type: String,
    default: ''
  },

  salutation: {
    type: String
  },
  fullname: {
    type: String,
    required: true
  },
  ph_country: {
    type: String,
    required: true
  },
  ph_number: {
    type: Number,
    required: true,
    unique: true
  },
  is_phone_verified: {
    type: Boolean,
    default: false
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    latnlong: {
      type: String,
      default: ''
    }
  },
  dob: {
    type: Date,
    required: true
  },
  batch: {
    type: Number,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    slug: "fullname", slug_padding_size: 4, unique: true
  },
  gender: {
    type: Number
  }, //1=Male, 2=Female, 3=Other
  membership_id: {
    type: String,
    default: ''
  },
  hostel: {
    type: String,
    default: ''
  },

  profile_line: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  aspirations: {
    type: String,
    default: ''
  },
  languages: [{
    name: {
      type: String,
      default: ''
    }
  }],
  dom: {
    type: Date
  },

  social_links: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  permanent_address: {
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    zip: {
      type: String,
      default: ''
    }
  },
  residential_address: {
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    zip: {
      type: String,
      default: ''
    }
  },

  entrepreneur: {
    type: Boolean,
    default: false
  },
  public_profile: {
    type: Boolean,
    default: true
  },
  donation_status: {
    type: Boolean,
    default: true
  },
  renowned_alumni: {
    type: Boolean,
    default: false
  },
  mentorship: {
    type: Boolean,
    default: false
  },

  profile_picture: {
    type: String,
    default: ''
  },
  last_update: {
    type: Date
  },
  dnd: {
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    notification: {
      type: Boolean,
      default: false
    }
  },

  education: [{
    degree: {
      type: String,
      default: ''
    },
    institute: {
      type: String,
      default: ''
    },
    stream: {
      type: String,
      default: ''
    },
    completion_year: {
      type: Date
    },
    description: {
      type: String,
      default: ''
    }
  }],
  job: [{
    designation: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    start_month: {
      type: String,
      default: ''
    },
    start_year: {
      type: String,
      default: ''
    },
    end_month: {
      type: String,
      default: ''
    },
    end_year: {
      type: String,
      default: ''
    },
    still_working: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ''
    }
  }],
  family: [{
    relationship: {
      type: Number,
      default: 1
    }, //1=father, 2=mother, 3=brother, 4=sister, 5=spouse, 6=other
    name: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    designation: {
      type: String,
      default: ''
    },
    ph_country: {
      type: String,
      default: ''
    },
    ph_number: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    profile_id: {
      type: String,
      default: ''
    }
  }],

  social_ids: {
    google: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  }
});

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, UserSchema);
  }
  return establishedModels[name];
}

// UserSchema.options.toJSON = {
//   transform: function(doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     // delete ret.__v;
//   }
// };

const collection = 'users';
// const User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.getProfileData = function (slug = '', db_slug = '') {
  if (db_slug === '' || slug === '') return false;

  let db_name = db_slug + '-' + collection;
  let User = createModelForName(db_name); // Create the db model.

  // const query = {};
  // query["slug"] = slug;
  let query = { slug: slug };
  return User.findOne(query)
    .then(data => {
      if(!data)  return { success: false, msg: "User not found" }
      return { success: true, msg: "User details found", data: data }
    })
    .catch(err => ({ success: false, msg: "something went wrong" }));
}

module.exports.getUserList = (pageSize, skip, sortby, orderby, query, db_slug = '') => {

  if (db_slug === '') return false;

  let db_name = db_slug + '-' + collection;
  let User = createModelForName(db_name); // Create the db model.

  // console.log("limit- " + pageSize);
  // console.log("skip- " + skip);
  // console.log("sort- " + sortby);
  // console.log("order- " + orderby);
  // console.log("query- " + JSON.stringify(query));
  const field = { _id: 0, email: 1, user_status: 1, user_type: 1, salutation: 1, fullname: 1, ph_country: 1, ph_number: 1, location: 1, batch: 1, course: 1, slug: 1, gender: 1, profile_line:1, profile_picture: 1, mentorship: 1, renowned_alumni: 1, public_profile: 1, hostel: 1, membership_id: 1 };
  return Promise.all([
    User.count().then(count => ({ total: count })),
    User.count(query).then(count => ({ searched_total: count })),
    User.find(query, field)
    .sort([ [sortby, orderby] ])
    .skip(skip)
    .limit(pageSize)
    .then(data => ({ rows: data }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {}));

}

module.exports.export2CSV = (req, res) => {
  // var User = mongoose.model('Users', UserSchema);
  let db_name = req.cookies['siteHeader'].db_slug + '-' + collection;
  let User = createModelForName(db_name); // Create the db model.
  const query = User.find();

  const transformer = (doc) => {
    return {

      Salutation: doc.salutation,
      Fullname: doc.fullname,
      Email: doc.email,
      IS_email_verified: (doc.is_email_verified) ? 'Yes' : 'No',
      User_status: {
        1: 'pending',
        2: 'approved',
        3: 'rejected',
        4: 'suspend'
      }[doc.user_status], //1=pending, 2=approved, 3=rejected, 4=suspend
      User_type: {
        1: 'Student',
        2: 'Alumni',
        3: 'Faculty',
        4: 'Alcom',
        5: 'CollegeAdmin',
        6: 'Administrator'
      }[doc.user_type], //1=Student,  2=Alumni, 3=Faculty, 4=alcom, 5=collegeAdmin, 6=Administrator
      User_registered_from: {
        1: 'Site registration',
        2: 'By Admin',
        3: 'By CSV Import',
        4: 'By Facebook',
        5: 'By Linkedin',
        6: 'By Google'
      }[doc.user_from],
      Registration_date: (doc.registered_on) ? new Date(doc.registered_on).toLocaleDateString() : '',
      Approved_on: (doc.approved_on) ? new Date(doc.approved_on).toLocaleDateString() : '',
      Approved_by: doc.approved_by_name,

      Ph_code: '\'' + doc.ph_country,
      Ph_number: '\'' + doc.ph_number,
      Is_ph_verified: (doc.is_phone_verified) ? 'Yes' : 'No',
      Location: doc.location.address + ', ' + doc.location.city + ', ' + doc.location.state + ', ' + doc.location.country,

      DOB: (doc.dob) ? new Date(doc.dob).toLocaleDateString() : '',
      Batch: doc.batch,
      Course: doc.course,
      Profile_slug: doc.slug,
      Gender: {
        1: 'Male',
        2: 'Female',
        3: 'Other'
      }[doc.gender], //1=Male, 2=Female, 3=Other
      Membership_Id: doc.membership_id,
      Hostel: doc.hostel,

      Profile_line: doc.profile_line,
      Summary: doc.summary,
      Aspirations: doc.aspirations,
      Languages: doc.languages,
      Date_of_Marriage: (doc.dom) ? new Date(doc.dom).toLocaleDateString() : '',

      Facebook: doc.social_links.facebook,
      Twitter: doc.social_links.twitter,
      Youtube: doc.social_links.youtube,
      Linkedin: doc.social_links.linkedin,

      Permanent_address: doc.permanent_address.address,
      Permanent_address_city: doc.permanent_address.city,
      Permanent_address_state: doc.permanent_address.state,
      Permanent_address_country: doc.permanent_address.country,
      Permanent_address_zip: doc.permanent_address.zip,

      Residential_address: doc.residential_address.address,
      Residential_address_city: doc.residential_address.city,
      Residential_address_state: doc.residential_address.state,
      Residential_address_country: doc.residential_address.country,
      Residential_address_zip: doc.residential_address.zip,

      Entrepreneur: doc.entrepreneur,
      Public_profile: doc.public_profile,
      Donation_status: doc.donation_status,
      Renowned_alumni: doc.renowned_alumni,
      Mentorship: doc.mentorship,

      profile_picture: (doc.profile_picture === '') ? 'No' : 'Yes',
      Last_update: (doc.last_update) ? new Date(doc.last_update).toLocaleDateString() : '',
      DND_email: (doc.dnd.email) ? 'Yes' : '',
      DND_sms: (doc.dnd.sms) ? 'Yes' : '',
      DND_notification: (doc.dnd.notification) ? 'Yes' : ''
    };
  }

  const filename = 'export.csv';

  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.writeHead(200, {
    'Content-Type': 'text/csv'
  });

  res.flushHeaders();

  var csvStream = fastCsv.createWriteStream({
    headers: true
  }).transform(transformer)
  query.cursor().pipe(csvStream).pipe(res);
}

module.exports.importCSV = (userFile, res) => {
  // console.log(req);
  // if (!req.files)
  //   return res.status(400).send('No files were uploaded.');

  // let userFile = req.files.file;
  let stream = fs.createReadStream(__dirname + '/../public/csv/' + userFile);
  let users = [];

  const transformer = (doc) => {
    return {
      email: doc.Email,
      is_email_verified: (doc.IS_email_verified === 'Yes') ? true : false,
      user_status: {
        'pending': 1,
        'approved': 2,
        'rejected': 3,
        'suspend': 4
      }[doc.User_status], //1=pending, 2=approved, 3=rejected, 4=suspend
      user_type: {
        'Student': 1,
        'Alumni': 2,
        'Faculty': 3,
        'Alcom': 4,
        'CollegeAdmin': 5,
        'Administrator': 6
      }[doc.User_type], //1=Student,  2=Alumni, 3=Faculty, 4=alcom, 5=collegeAdmin, 6=Administrator
      user_from: {
        'Site registration': 1,
        'By Admin': 2,
        'By CSV Import': 3,
        'By Facebook': 4,
        'By Linkedin': 5,
        'By Google': 6
      }[doc.User_registered_from],
      registered_on: (doc.Registration_date) ? new Date(doc.Registration_date).toLocaleDateString() : new Date,
      approved_on: (doc.Approved_on) ? new Date(doc.Approved_on).toLocaleDateString() : new Date,
      approved_by_name: doc.Approved_by,

      salutation: doc.Salutation,
      fullname: doc.Fullname,
      ph_country: doc.Ph_code.replace(/["']/g, ""),
      ph_number: Number(doc.Ph_number.replace(/["']/g, "")),
      is_phone_verified: (doc.Is_ph_verified === 'Yes') ? true : false,
      location: ( doc.Location.indexOf(',') > 0 ) ? {address: doc.Location.split(',')[0]} : '' ,

      dob: (doc.DOB) ? new Date(doc.DOB).toLocaleDateString() : '',
      batch: doc.Batch,
      course: doc.Course,
      // slug: module.exports.getSlug(doc.Profile_slug),
      gender: {
        'Male': 1,
        'Female': 2,
        'Other': 3
      }[doc.Gender], //1=Male, 2=Female, 3=Other
      membership_id: doc.Membership_Id,
      hostel: doc.Hostel,

      profile_line: doc.Profile_line,
      summary: doc.Summary,
      aspirations: doc.Aspirations,
      // languages: doc.Languages,
      dom: (doc.Date_of_Marriage) ? new Date(doc.Date_of_Marriage).toLocaleDateString() : '',

      // Permanent_address: doc.permanent_address.address,
      // Permanent_address_city: doc.permanent_address.city,
      // Permanent_address_state: doc.permanent_address.state,
      // Permanent_address_country: doc.permanent_address.country,
      // Permanent_address_zip: doc.permanent_address.zip,

      // Residential_address: doc.residential_address.address,
      // Residential_address_city: doc.residential_address.city,
      // Residential_address_state: doc.residential_address.state,
      // Residential_address_country: doc.residential_address.country,
      // Residential_address_zip: doc.residential_address.zip,

      entrepreneur: (doc.Entrepreneur === 'true') ? true : false,
      public_profile: (doc.Public_profile === 'true') ? true : false,
      donation_status: (doc.Donation_status === 'true') ? true : false,
      renowned_alumni: (doc.Renowned_alumni === 'true') ? true : false,
      mentorship: (doc.Mentorship === 'true') ? true : false,

      profile_picture: (doc.profile_picture === '') ? 'No' : 'Yes',
      Last_update: new Date
    }
  };

  fastCsv
    // .fromString(userFile.data.toString(), {
    .fromStream(stream, {
      headers: true,
      ignoreEmpty: true
    })
    .on("data", function (data) {
      console.log(data);
      data = transformer(data);
      console.log(data);
      data['_id'] = new mongoose.Types.ObjectId();
      data['_id'] = '5a228b503e26f85d67c3b3ac';
      users.push(data);
    })
    .on("end", function () {
      console.log("done");
      console.log(users);
      User.create(users, function (err, documents) {
        if (err) {
          throw err;
          return res.send(users.length + ' Unable to save.' + err);
        }
      });

      return res.send(users.length + ' authors have been successfully uploaded.');
    });
}

module.exports.checkemailavailable = (email, db_slug = '') => {
  
  if (db_slug === '') return false;

  let db_name = db_slug + '-' + collection;
  let User = createModelForName(db_name); // Create the db model.

  const query = {};
  query["email"] = email;
  // query["_id"] = 1;

  // 'profile_slug': slug
  // return Promise.all([
  return User.count(query)
    .then(data => ({ success: true, msg: "User details found", data: data }))
    .catch(err => ({ success: false, msg: "something went wrong" }));
  // ]).then(result => result.reduce((acc, curr) =>
  //   Object.assign(acc, curr), {}));
  // return true;
}

module.exports.deleteUserById = (req) => {
  id = req.query.userID;
  User.findByIdAndRemove(id, function (err, res) {
    if (err) {
      throw err;
    }
    if (res.result.n === 0) {
      console.log("Record not found");
    }
    console.log("Deleted successfully.");
  });
}

module.exports.profileAdd = (profileData, db_slug = '') => {
  
  if (db_slug === '') return false;

  let db_name = db_slug + '-' + collection;
  let User = createModelForName(db_name); // Create the db model.
  // console.log('profileData',profileData);
  let data = new User(profileData);

  let getSalt = () => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        }
        resolve(salt);
      })
    })
  }

  let getHash = (salt) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data.password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    })
  }
  return getSalt().then((salt) => {
      return getHash(salt);
    }).then((hash) => {
      data.password = hash;
      // console.log('call save here', data.password);
      return data.save();
    })
    .then(item => ({
      msg: "item saved to database",
      status: true
    }))
    .catch(err => ({
      msg: "unable to save to database",
      status: false
    }));

  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });

  // return data.save()
  // .then(item => ({ msg: "item saved to database", status: true }))
  // .catch(err => ({ msg: "unable to save to database", status: false }));
}

module.exports.getUserByUsername = ( db_slug = '', query) => {
  
  if (db_slug === '') return false;

  let db_name = db_slug + '-' + collection;
  let User = createModelForName(db_name); // Create the db model.

  // const query = { $and: [{ email: username }, { user_type: 5 } ] }
  const field = { _id: 0, email: 1, password: 1, registration_type: 1, salutation: 1, fullname: 1, batch: 1, course: 1, slug: 1, profile_picture: 1, mentorship: 1, renowned_alumni: 1, public_profile: 1, profile_line: 1, user_type: 1, hostel: 1, membership_id: 1, location: 1 };
  return User.findOne(query, field)
    .then(data => {
      // throw err;
      if(data)
      return ({ success: true, msg: "user found", data: data })
      else
      return ({ success: false, msg: "user not found" })
    })
    .catch(err => ({ success: false, msg: "something went wrong" }));
}
module.exports.comparePassword = (candidatePassword, dbHash) => {
  // console.log( 'Entered password', candidatePassword );
  // console.log( 'DB password', dbHash );
  return bcrypt.compare(candidatePassword, dbHash)
    .then(data => data)
    .catch(err => err);
}