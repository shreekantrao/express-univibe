const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');
// const config = require('../config/keys');
const fastCsv = require('fast-csv');
// User Schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  is_email_verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
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
  }, //1=registration, 2=admin, 3=import, 4=facebook, 5=linkedin, 6=google
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
    required: true
  },
  is_phone_verified: {
    type: Boolean,
    default: false
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    latnlong: { type: String, default: '' }},
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
    required: true
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
  languages: {
    type: String,
    default: ''
  },
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
    google: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' }}
});

// UserSchema.options.toJSON = {
//   transform: function(doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     // delete ret.__v;
//   }
// };

const User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.getProfileData = function (slug) {
  const query = {};
  query["profile_slug"] = slug;
  // 'profile_slug': slug
  return Promise.all([
    User.findOne(query)
    .then(data => ({
      data: data
    }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {}));
}

module.exports.getUserList = (pageSize, skip, sortby, orderby, query) => {

  // console.log("limit- " + pageSize);
  // console.log("skip- " + skip);
  // console.log("sort- " + sortby);
  // console.log("order- " + orderby);
  // console.log("query- " + JSON.stringify(query));

  return Promise.all([
    User.count().then(count => ({
      total: count
    })),
    User.count(query).then(count => ({
      searched_total: count
    })),
    User.find(query)
    .sort([
      [sortby, orderby]
    ])
    .skip(skip)
    .limit(pageSize)
    .then(data => ({
      rows: data
    }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {}));

}

module.exports.export2CSV = (req, res) => {
  // var User = mongoose.model('Users', UserSchema);

  const query = User.find();

  const transformer = (doc) => {
    return {

      Salutation:                   doc.salutation,
      Name:                         doc.fullname,
      Email:                        doc.email,
      IS_email_verified:            (doc.is_email_verified)?'Yes':'No',
      User_status:                  {1:'pending', 2:'approved', 3:'rejected', 4:'suspend'}[doc.user_status], //1=pending, 2=approved, 3=rejected, 4=suspend
      User_type:                    {1:'Student',  2:'Alumni', 3:'Faculty', 4:'Alcom', 5:'CollegeAdmin', 6:'Administrator'}[doc.user_type], //1=Student,  2=Alumni, 3=Faculty, 4=alcom, 5=collegeAdmin, 6=Administrator
      User_registered_from:         {1:'Site registration', 2:'By Admin', 3:'By CSV Import', 4:'By Facebook', 5:'By Linkedin', 6:'By Google'}[doc.user_from],
      Registration_date:            (doc.registered_on)?new Date(doc.registered_on).toLocaleDateString():'',
      Approved_on:                  (doc.approved_on)?new Date(doc.approved_on).toLocaleDateString():'',
      Approved_by:                  doc.approved_by_name,
    
      Ph_code:                      '\''+doc.ph_country,
      Ph_number:                    '\''+doc.ph_number,
      Is_ph_verified:               (doc.is_phone_verified)?'Yes':'No',
      Location:                     doc.location.address+', '+doc.location.city+', '+doc.location.state+', '+doc.location.country,

      DOB:                          (doc.dob)?new Date(doc.dob).toLocaleDateString():'',
      Batch:                        doc.batch,
      Course:                       doc.course,
      Profile_slug:                 doc.slug,
      Gender:                       {1:'Male', 2:'Female', 3:'Other'}[doc.gender], //1=Male, 2=Female, 3=Other
      Membership_Id:                doc.membership_id,
      Hostel:                       doc.hostel,
    
      Profile_line:                 doc.profile_line,
      Summary:                      doc.summary,
      Aspirations:                  doc.aspirations,
      Languages:                    doc.languages,
      Date_of_Marriage:             (doc.dom)?new Date(doc.dom).toLocaleDateString():'',
    
      Facebook:                     doc.social_links.facebook,
      Twitter:                      doc.social_links.twitter,
      Youtube:                      doc.social_links.youtube,
      Linkedin:                     doc.social_links.linkedin,

      Permanent_address:            doc.permanent_address.address,
      Permanent_address_city:       doc.permanent_address.city,
      Permanent_address_state:      doc.permanent_address.state,
      Permanent_address_country:    doc.permanent_address.country,
      Permanent_address_zip:        doc.permanent_address.zip,

      Residential_address:          doc.residential_address.address,
      Residential_address_city:     doc.residential_address.city,
      Residential_address_state:    doc.residential_address.state,
      Residential_address_country:  doc.residential_address.country,
      Residential_address_zip:      doc.residential_address.zip,
    
      Entrepreneur:                 doc.entrepreneur,
      Public_profile:               doc.public_profile,
      Donation_status:              doc.donation_status,
      Renowned_alumni:              doc.renowned_alumni,
      Mentorship:                   doc.mentorship,
    
      profile_picture:              (doc.profile_picture==='')?'No':'Yes',
      Last_update:                  (doc.last_update)?new Date(doc.last_update).toLocaleDateString():'',
      DND_email:                    (doc.dnd.email)?'Yes':'',
      DND_sms:                      (doc.dnd.sms)?'Yes':'',
      DND_notification:             (doc.dnd.notification)?'Yes':''
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

module.exports.checkemailavailable = (email) => {
  const query = {};
  query["email"] = email;
  // query["_id"] = 1;
  
  // 'profile_slug': slug
  return Promise.all([
    User.count(query)
    .then(data => ({
      data: data
    }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {}));
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

module.exports.profileAdd = (profileData) => {
  // console.log('profileData',profileData);
  let data = new User(profileData);
  // return data.save()
  //   .then(item => ({ msg: "Profile saved to database" }))
  //   .catch(err => ({ msg: "Unable to save to database" }));
  // await data.save(function(err) {
  //   if(err){console.error(err); throw err;}
  //   // console.log('data',data._id)
  //   return data._id;
  // });
  return data.save()
  .then(item => ({ msg: "item saved to database", status: true }))
  .catch(err => ({ msg: "unable to save to database", status: false }));
}

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}