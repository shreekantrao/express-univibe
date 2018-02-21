var status = require('../models/status');

module.exports = { 

    getStatusList: async(req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            let searchText = req.query.search;
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

            let data = await status.getStatusList(pageSize, skip, sortby, orderby, query, db_slug)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'status not found'
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
    changeState: async(req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            let data = await status.changeState(req.body.slug, req.body.state, db_slug)
            // console.log('Controller - ',data);
            // if (!data.success) {
            //     return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            // }
           
            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    deleteStatus: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            let data = await status.deleteStatus(req.body.slug, db_slug)
            // console.log('Controller - ', data);
            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    }
}