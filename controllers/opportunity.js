var opportunity = require('../models/opportunity');

module.exports = { 

    getOpportunityList: async(req, res, next) => {
        // console.log('controller userslist');
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            
            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            alphabet = req.params.alphabet;
            // console.log("alphabet= "+alphabet);
            searchText = req.query.search;

            let query = {};

            if (typeof searchText != 'undefined') {
                // var regexp = new RegExp("^" + searchText);
                // var query = { $or: [{ "description": searchText }, { "posted_by.name": searchText }] };
                query = { $text: { $search: searchText } };
                // console.log("regexp- "+regexp);
                // query["description"] = regexp;
            }

            let sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            let orderby = -1;

            let data = await opportunity.getOpportunityList(pageSize, skip, sortby, orderby, query, db_slug);
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'opportunity not found'
                });
            }
            data["pageSize"] = pageSize;
            setTimeout(() => { res.json(data); }, 2000);            
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    changeState: async(req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            
            let data = await opportunity.changeState(req.body.slug, req.body.state, db_slug);
            // console.log('Controller - ',data);
           
            setTimeout(() => { res.json(data); }, 2000);            
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    deleteOpportunity: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await opportunity.deleteOpportunity(req.body.slug, db_slug);
            console.log('Controller - ', data);
            
            setTimeout(() => { res.json(data); }, 2000); 
        } catch (e) {
            next(e);
        }
    },

    saveOpportunity: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log(req.body);
            let formData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                ref_link: req.body.ref_link,
                last_date_to_apply: req.body.last_date_to_apply,
                attachement: req.body.attachement.split(','),
                company: req.body.company,
                industry: req.body.industry,
                skills: req.body.skills.split(','),
                contact_email: req.body.contact_email,
                contact_phone: req.body.contact_phone,
                location: req.body.location,
                salary: {
                    min: req.body.salary_min,
                    max: req.body.salary_max,
                },
                experience: {
                    min: req.body.experience_min,
                    max: req.body.experience_max,
                },
                positions: req.body.positions,
                posted_by: {
                    user_id: req.body.user_id,
                    name: req.body.name,
                    profile_line: req.body.profile_line,
                    profile_pic: req.body.profile_pic,
                    batch: req.body.batch,
                    course: req.body.course,
                    gender: req.body.gender
                },
                tag: req.body.tag.split(','),
                publish: req.body.publish
            };
            console.log(formData);
            let data = await opportunity.saveOpportunity(formData, db_slug);
            console.log('Controller - ', data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Opportunity found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
   
}