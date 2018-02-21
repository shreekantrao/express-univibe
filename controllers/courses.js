var courses = require('../models/courses');

module.exports = {

    getCourseList: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            var query = {};

            let sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            let orderby = -1;

            let data = await courses.getCourseList(pageSize, skip, sortby, orderby, query, db_slug)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'courses not found'
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
    checkCourseNameExists: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let data = await courses.checkCourseNameExists(req.body.name, req.body.slug, db_slug)
            // console.log('Controller - ',data);
            if (!data.success) {
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            setTimeout(() => {
                res.json(data.name ? 'Course already exist.' : true);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    createNewCourse: async (req, res, next) => {
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

            let data = await courses.createNewCourse(body, db_slug)
            // console.log('data ', data);

            delete data.data._id;
            setTimeout(() => {
                res.json({ success: data.success, msg: data.msg, data: data.data });
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    updateCourse: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await courses.updateCourse(req.body, db_slug)
            // console.log('Course data 1 - ',data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    deleteCourse: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            if (!req.body.slug) return res.json(false);

            let data = await courses.deleteCourse(req.body.slug, db_slug);
            // console.log('data from model', data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    }
}