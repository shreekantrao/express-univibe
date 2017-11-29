const network = require('../models/network');
// const csv = require('csv-express')
module.exports = {

    userslist : async (req, res, next) => {
            // console.log('controller userslist');
        try {

            pageSize = 6;
            
            skip = parseInt(req.params.page_no);
            if(isNaN(skip)) skip = 1;
            skip = (skip-1)*pageSize;
            if(skip < 0) skip = 0;

            alphabet = req.params.alphabet;
            // console.log("alphabet= "+alphabet);

            var query = {};

            if( typeof alphabet != 'undefined' ) {
                var regexp = new RegExp("^"+ alphabet);
                // console.log("regexp- "+regexp);
                query["fullname"] = regexp;
            }
            
            sortby = req.query.sort;
            if(typeof sortby == 'undefined')
            sortby="fullname";
            orderby = 1;
            
            // console.log("limit- "+pageSize);
            // console.log("skip- "+skip);
            // console.log("sort- "+sortby);
            // console.log("order- "+orderby);

            let data = await network.getUserList(pageSize, skip, sortby, orderby, query)
            if(!data) {
                return res.json({success: false, msg: 'Users not found'});
            }
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
        try{
            return network.importCSV(req, res);
        } catch(e){
            next(e);
        }
    },

    checkemailavailable : async (req, res, next) => {
        try{
            let check = await network.checkemailavailable(req.body.email);
            // console.log('check',check)
            res.send((check.data)?false:true);
        } catch(e){
            next(e);
        }
    },

    profileData : async (req, res) => {
            // console.log('controller userslist');
        try 
        {
            slug = req.params.slug;
            // console.log('slug - '+slug);
            let data = await network.getProfileData(slug)
            // console.log("Con data ="+JSON.stringify(data.data));
            if(!data) {
                return {success: false, msg: 'Users not found'};
            }
            // return data;
            res.render('page', {"page_Code":"profile","page_Title":"Profile", "data":data.data});
        } catch(e) {
            next(e);
        }
    },

    profileAdd: async(req, res, next) => {
        try {
            let formData = req.body;
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

            const transformer = (doc) => {
                return {
            
                    email:                          doc.email,
                    password:                       doc.password,
                    user_status:                    doc.user_status,
                    user_type:                      doc.user_type,
                    user_from:                      doc.user_from,
                    approved_on:                    new Date(),
                    approved_by:                    'admin_id',
                    approved_by_name:               'admin_name',
                    activation_key:                 'temp_key',
                    salutation:                     doc.salutation,
                    fullname:                       doc.fullname,
                    ph_country:                     doc.ph_country,
                    ph_number:                      parseInt(doc.ph_number),
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
                    slug:                           'User_slug',
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
                    mentorship:                     doc.mentorship
                };
            }
            
            // return res.json(req.body);
            let data = await network.profileAdd(transformer(formData))
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