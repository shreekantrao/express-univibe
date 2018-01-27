const network = require('../models/network');
// const csv = require('csv-express')

module.exports = {

    userslist : async (req, res, next) => {
            // console.log('controller userslist');
            
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log( 'db_slug', db_slug );
            let pageSize = 9;
            
            let skip = parseInt(req.params.page_no);
            if(isNaN(skip)) skip = 1;
                skip = (skip-1)*pageSize;
            if(skip < 0) skip = 0;

            alphabet = req.params.alphabet;
            // console.log("alphabet= "+alphabet);

            let query = {};

            if( typeof alphabet != 'undefined' ) {
                var regexp = new RegExp("^"+ alphabet);
                // console.log("regexp- "+regexp);
                query["fullname"] = regexp;
            }
            
            let sortby = req.query.sort;
            if(typeof sortby == 'undefined')
             sortby="fullname";
            let orderby = 1;
            
            // console.log("limit- "+pageSize);
            // console.log("skip- "+skip);
            // console.log("sort- "+sortby);
            // console.log("order- "+orderby);

            let data = await network.getUserList(pageSize, skip, sortby, orderby, query, db_slug);
            // console.log("Network model data =", data);
            if(!data) {
                return res.json({success: false, msg: 'Users not found'});
            }
            data["pagesize"] = pageSize;
            res.json(data);
        } catch(e) {
            next(e);
        }
    },

    export2CSV : (req, res, next) => {
        try{
            return network.export2CSV(req, res);
        } catch(e){
            next(e);
        }
    },

    importCSV : (req, res, next) => {
        // console.log(req);
        try{
            if (!req.files)
                return res.json({msg: 'No files were uploaded.'});
            let userFile = req.files.csvfile;
            let filename = 'user_csv_' + new Date().getTime() +'.csv';
             // Use the mv() method to place the file somewhere on your server
             userFile.mv(__dirname + '/../public/csv/'+filename, function(err) {
               if (err){
                   console.log(err);
                   return res.json({ msg: err });
               }
                //  res.json({ msg: 'File uploaded.' });
                 return network.importCSV(req, res, filename);
             });
        } catch(e){
            next(e);
        }
    },

    checkemailavailable : async (req, res, next) => {
        try{
            let db_slug = req.cookies['siteHeader'].db_slug;
            let check = await network.checkemailavailable(req.body.email, req.body.slug, db_slug);
            // console.log('check',check)
            setTimeout(() => {
                res.send((check.data)?'"Already taken."':true);
            }, 5000);
        } catch(e){
            next(e);
        }
    },

    checkphoneavailable : async (req, res, next) => {
        try{
            let db_slug = req.cookies['siteHeader'].db_slug;
            let ph_number = parseInt(req.body.ph_number.replace('-', '').replace(' ', '').trim());
            let check = await network.checkphoneavailable(req.body.ph_country, ph_number, req.body.slug, db_slug);
            // console.log('check',check)
            setTimeout(() => {
                res.send((check.data)?'"Already taken."':true);
            }, 5000);
        } catch(e){
            next(e);
        }
    },

    getProfileData : async (req, res) => {
            // console.log('controller userslist');
        try 
        {
            let db_slug = req.cookies['siteHeader'].db_slug;
            slug = req.params.slug;

            let data = await network.getProfileData(slug, db_slug)
            // console.log("Network model data =", data);
            if(!data.success) {
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "data.msg" });
                req.session.notify = notify;
                return res.redirect('/network/list');
            }
            res.render('page', {"page_Code":"profile","page_Title":"Profile", "data":data.data});
        } catch(e) {
            next(e);
        }
    },
    
    addProfileData: async(req, res, next) => {
        try {
            let formData = req.body;
            let userFile = req.files.profilepic;
            let filename = '';
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('formData', formData);
            
            // check for mandatory fields
            if( formData.salutation===''||
                formData.fullname===''||
                formData.email===''||
                formData.ph_number===''||
                formData.batch===''||
                formData.course===''||
                formData.address===''||
                formData.password===''){
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                req.session.notify = notify;
                console.log('Form not filled properly.');
                return res.redirect('/network/add');
            }    
            
            const processImg = (name) => {
                if (!userFile){
                    filename = '/' + db_slug +'/lego/' + Math.floor((Math.random() * 10) + 1) + '.jpg';
                    return filename;
                }else{
                    filename = name.toLowerCase().replace(' ', '') +'_'+ new Date().getTime() + '.' + userFile.name.split('.').pop();
                    return '/' + db_slug + '/profile_img/' + filename;
                } 
            }    

            const transformer = (doc) => {
                return {
            
                    email:                          doc.email,
                    password:                       doc.password,
                    user_status:                    doc.user_status,
                    user_type:                      doc.user_type,
                    user_from:                      doc.user_from,
                    approved_on:                    new Date(),
                    approved_by_id:                 req.cookies['userHeader'].slug,
                    approved_by_name:               req.cookies['userHeader'].fullname,
                    activation_key:                 'temp_key',
                    salutation:                     doc.salutation,
                    fullname:                       doc.fullname,
                    ph_country:                     doc.ph_country,
                    ph_number:                      parseInt( doc.ph_number.replace('-','').replace(' ','').trim() ),
                    location:{
                        address:                    doc.address,
                        city:                       doc.city,
                        state:                      doc.state,
                        country:                    doc.country,
                        latnlong:                   doc.latnlong
                    },
                    dob:                            doc.dob,
                    batch:                          doc.batch,
                    course:                         doc.course,
                    gender:                         doc.gender,
                    membership_id:                  doc.membership_id,
                    hostel:                         doc.hostel,
                    profile_line:                   doc.profile_line,
                    summary:                        doc.summary,
                    aspirations:                    doc.aspirations,
                    dom:                            doc.dom,
                    entrepreneur:                   doc.entrepreneur,
                    public_profile:                 doc.public_profile,
                    donation_status:                doc.donation_status,
                    renowned_alumni:                doc.renowned_alumni,
                    mentorship:                     doc.mentorship,
                    profile_picture:                processImg(doc.fullname)
                };
            }
            
            // return res.json(req.body);
            let data = await network.addProfileData(transformer(formData), userFile, filename, db_slug)
            console.log('retrun from model',data);
            if (data.status) {
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "New Profile successfully created." });
                req.session.notify = notify;
                return res.redirect('/network/add');
            }else{
                let notify = [];
                notify.push({ title: "Notification", type: "alert", text: "New Profile could not be created." });
                req.session.notify = notify;
                return res.redirect('/network/add');
            }
        } catch (e) {
            // next(e);
            throw e;
        }
    },

    updateProfileData: async(req, res, next) => {
        try {
            let formData = req.body;
            let userFile = req.files.profilepic;
            let filename = '';
            let db_slug = req.cookies['siteHeader'].db_slug;
            console.log('controller formData', formData);
            console.log('controller formFile', userFile);
            
            // check for mandatory fields
            if( formData.salutation===''||
                formData.fullname===''||
                formData.email===''||
                formData.slug===''||
                formData.ph_number===''||
                formData.batch===''||
                formData.course===''||
                formData.address===''){
                    let notify = [];
                    notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                    req.session.notify = notify;
                    console.log('Form not filled properly.');
                    // return res.redirect('/network/add');
            }    
            
            const processImg = (name) => {
                if (!userFile){
                    filename = '/' + db_slug +'/lego/' + Math.floor((Math.random() * 10) + 1) + '.jpg';
                    return filename;
                }else{
                    filename = name.toLowerCase().replace(' ', '') +'_'+ new Date().getTime() + '.' + userFile.name.split('.').pop();
                    return '/' + db_slug + '/profile_img/' + filename;
                } 
            }    

            const transformer = (doc) => {
                return {
            
                    email:                          doc.email,
                    slug:                           doc.slug,
                    password:                       doc.password,
                    temp_password:                  doc.temp_password||'',
                    user_status:                    parseInt(doc.user_status),
                    user_type:                      parseInt(doc.user_type),
                    salutation:                     doc.salutation,
                    fullname:                       doc.fullname,
                    ph_country:                     doc.ph_country,
                    ph_number:                      parseInt( doc.ph_number.replace('-','').replace(' ','').trim() ),
                    location:{
                        address:                    doc.address,
                        city:                       doc.city,
                        state:                      doc.state,
                        country:                    doc.country,
                        latnlong:                   doc.latnlong
                    },
                    dob:                            (doc.dob?new Date(doc.dob):null),
                    batch:                          doc.batch,
                    course:                         doc.course,
                    gender:                         parseInt(doc.gender),
                    membership_id:                  doc.membership_id,
                    hostel:                         doc.hostel,
                    profile_line:                   doc.profile_line,
                    summary:                        doc.summary,
                    aspirations:                    doc.aspirations,
                    dom:                            (doc.dom?new Date(doc.dom):null),
                    entrepreneur:                   (doc.entrepreneur=='on'?true:false),
                    public_profile:                 (doc.public_profile=='on'?true:false),
                    donation_status:                (doc.donation_status=='on'?true:false),
                    renowned_alumni:                (doc.renowned_alumni=='on'?true:false),
                    mentorship:                     (doc.mentorship=='on'?true:false),
                    profile_picture:                doc.oldprofilepic || processImg(doc.fullname)
                };
            }
            
            // return res.json(req.body);
            let data = await network.updateProfileData(transformer(formData), userFile, filename, db_slug)
            console.log('retrun from model',data);
            if (data.status) {
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "New Profile successfully created." });
                req.session.notify = notify;
                return res.redirect('/network/add');
            }else{
                let notify = [];
                notify.push({ title: "Notification", type: "alert", text: "New Profile could not be created." });
                req.session.notify = notify;
                return res.redirect('/network/add');
            }
        } catch (e) {
            // next(e);
            throw e;
        }
    },
}    