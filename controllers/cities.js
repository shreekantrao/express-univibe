var cities = require('../models/cities');

module.exports = {

    getCityList: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            let query = {};

            let sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            let orderby = -1;

            let data = await cities.getCityList(pageSize, skip, sortby, orderby, query, db_slug);
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'cities not found'
                });
            }
            data["pageSize"] = pageSize;
            setTimeout(() => { res.json(data); }, 2000);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    checkCityNameExists: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let data = await cities.checkCityNameExists(req.body.name, req.body.slug, db_slug)
            // console.log('Controller - ',data);
            if (!data.success) {
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            setTimeout(() => {
                res.json(data.name ? 'City already exist.' : true);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    createNewCity: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let body = req.body;
            if (body.name === '') {
                console.log('Form not filled.');
                return res.json({
                    success: false,
                    msg: 'Your form is not properly filled.'
                });
            }
            if (body.image === '') delete body.image;

            let data = await cities.createNewCity(body, db_slug)
            // console.log('data ', data);
            
            delete data.data._id;
            setTimeout(() => {
                res.json({ success: data.success, msg: data.msg, data: data.data });
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    updateCity: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await cities.updateCity(req.body, db_slug)
            // console.log('City data 1 - ',data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    deleteCity: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await cities.deleteCity(req.body.slug, db_slug);
            // console.log('data from model', data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    }
}