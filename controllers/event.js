var event = require('../models/event');

module.exports = { 

    getEventList: async(req, res, next) => {
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

            let data = await event.getEventList(pageSize, skip, sortby, orderby, query, db_slug);
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'event not found'
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
            
            let data = await event.changeState(req.body.slug, req.body.state, db_slug);
            // console.log('Controller - ',data);
          
            setTimeout(() => { res.json(data); }, 2000);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    deleteEvent: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await event.deleteEvent(req.body.slug, db_slug);
            // console.log('Controller - ', data);
           
            setTimeout(() => { res.json(data); }, 2000);
        } catch (e) {
            next(e);
        }
    },

    saveEvent: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            console.log(req.body);
            let formData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                tag_line: req.body.tag_line,
                positions: req.body.positions,
                fees: req.body.fees,
                start_date: req.body.start_date,
                start_time: req.body.start_time,
                end_date: req.body.end_date,
                end_time: req.body.end_time,
                location: req.body.location,
                images: req.body.images.split(','),
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
            let data = await event.saveEvent(formData, db_slug);
            console.log('Controller - ', data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Event found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
   
}