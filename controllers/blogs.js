var blogs = require('../models/blogs');

module.exports = { 

    getBlogsList: async(req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            let searchText = req.query.search;

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

            let data = await blogs.getBlogsList(pageSize, skip, sortby, orderby, query, db_slug);
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'blogs not found'
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
            let data = await blogs.changeState(req.body.slug, req.body.state, db_slug)
            // console.log('Controller - ',data);
            
            setTimeout(() => { res.json(data); }, 2000);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    deleteBlogs: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;            
            let data = await blogs.deleteBlogs(req.body.slug, db_slug)
            // console.log('Controller - ', data);
           
            setTimeout(() => { res.json(data); }, 2000);            
        } catch (e) {
            next(e);
        }
    }
   
}