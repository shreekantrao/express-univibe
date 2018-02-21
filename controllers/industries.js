var industries = require('../models/industries');

module.exports = {

    getIndustryList: async (req, res, next) => {
        // console.log('controller userslist');
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            var query = {};

            // if (typeof alphabet != 'undefined') {
            //     var regexp = new RegExp("^" + alphabet);
            //     // console.log("regexp- "+regexp);
            //     query["fullname"] = regexp;
            // }

            let sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            let orderby = -1;

            let data = await industries.getIndustryList(pageSize, skip, sortby, orderby, query, db_slug)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'industries not found'
                });
            }
            data["pageSize"] = pageSize;
            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    checkIndustryNameExists: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let data = await industries.checkIndustryNameExists(req.body.name, req.body.slug, db_slug)
            // console.log('Controller - ',data);
            if (!data.success) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Industry found." });
            // req.session.notify = notify;  
            setTimeout(() => {
                res.json(data.name ? 'Industry already exist.' : true);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    createNewIndustry: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let body = req.body;
            if (body.name === '') {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                // req.session.notify = notify;
                console.log('Form not filled.');
                return res.json({
                    success: false,
                    msg: 'Your form is not properly filled.'
                });
            }
            if (body.image === '') delete body.image;

            let data = await industries.createNewIndustry(body, db_slug)
            // console.log('data ', data);

            delete data.data._id;
            setTimeout(() => {
                res.json({ success: data.success, msg: data.msg, data: data.data });
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    updateIndustry: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await industries.updateIndustry(req.body, db_slug)
            // console.log('Industry data 1 - ',data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    deleteIndustry: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            if (!req.body.slug) return res.json(false);

            let data = await industries.deleteIndustry(req.body.slug, db_slug);
            // console.log('data from model', data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    }
}