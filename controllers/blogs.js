var blogs = require('../models/blogs');

module.exports = { 

    getBlogsList: async(req, res, next) => {
        // console.log('controller userslist');
        try {

            pageSize = 6;

            skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            alphabet = req.params.alphabet;
            // console.log("alphabet= "+alphabet);
            searchText = req.query.search;

            var query = {};

            if (typeof searchText != 'undefined') {
                // var regexp = new RegExp("^" + searchText);
                // var query = { $or: [{ "description": searchText }, { "posted_by.name": searchText }] };
                var query = { $text: { $search: searchText } };
                // console.log("regexp- "+regexp);
                // query["description"] = regexp;
            }

            sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            orderby = -1;

            // console.log("limit- "+pageSize);
            // console.log("skip- "+skip);
            // console.log("sort- "+sortby);
            // console.log("order- "+orderby);

            let data = await blogs.getBlogsList(pageSize, skip, sortby, orderby, query)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'blogs not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    changeState: async(req, res, next) => {
        try {
            let data = await blogs.changeState(req.body.slug, req.body.state)
            console.log('Controller - ',data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Blogs found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    deleteBlogs: async (req, res, next) => {
        try {
            let data = await blogs.deleteBlogs(req.body.slug)
            console.log('Controller - ', data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Blogs found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
   
}