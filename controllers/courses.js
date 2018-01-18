var courses = require('../models/courses');

module.exports = {

    getCourseList: async(req, res, next) => {
        // console.log('controller userslist');
        try {

            pageSize = 6;

            skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
            skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            alphabet = req.params.alphabet;
            // console.log("alphabet= "+alphabet);

            var query = {};

            // if (typeof alphabet != 'undefined') {
            //     var regexp = new RegExp("^" + alphabet);
            //     // console.log("regexp- "+regexp);
            //     query["fullname"] = regexp;
            // }

            sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            orderby = -1;

            // console.log("limit- "+pageSize);
            // console.log("skip- "+skip);
            // console.log("sort- "+sortby);
            // console.log("order- "+orderby);

            let data = await courses.getCourseList(pageSize, skip, sortby, orderby, query)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'courses not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createNewCourse: async(req, res, next) => {
        try {
            // console.log('check');
            let db_slug = req.cookies['siteHeader'].db_slug;
            let body = req.body;
            if(body.name===''||body.slug===''){
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                req.session.notify = notify;
                console.log('Form not filled.');
                return res.json({
                    success: false,
                    msg: 'Course not saved'
                });
            }  
            if( body.image === '') delete body.image;  

            let data = await courses.createNewCourse(body, db_slug)
            console.log('data ',data);
            if (!data.success) {
                return res.json({
                    success: false,
                    msg: 'Course not saved'
                });
            }
            res.json({
                success: true,
                msg: 'Course saved',
                data: data.data
            });
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    checkCourseNameExists: async(req, res, next) => {
        try {
            let data = await courses.checkCourseNameExists(req.body.name, req.body.slug, req.body._id)
            console.log('Controller - ',data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Course found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // getCourseData: async(req, res, next) => {
    //     try {
    //         let data = await courses.getCourseData(req.params.coursename)
    //         // console.log('Course data - ',data);
    //         // console.log('Course data2 - ',data.data);
    //         if (!data) {
    //             // return res.json({success: false, msg: 'Course not found'});
    //             let notify = [];
    //             notify.push({ title: "Notification", type: "notice", text: "Course not found." });
    //             req.session.notify = notify;
    //             return res.redirect('/courses/list');
    //             // return res.render('page', {"page_Code":"courses","page_Title":"Course Network", "data":{success: false, msg: 'Course not found'}});
    //         }
    //         res.render('page', { "page_Code": "course-edit", "page_Title": "Profile", "data": data.data });
    //     } catch (e) {
    //         next(e);
    //     }
    // },

    savecourse: async(req, res, next) => {
        try {
            let data = await courses.savecourse(req.body)
            console.log('Course data - ',data);
            // console.log('Course data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'Course not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Course not found." });
                req.session.notify = notify;
                return res.redirect('/courses/list');
                // return res.render('page', {"page_Code":"courses","page_Title":"Course Network", "data":{success: false, msg: 'Course not found'}});
            }
            res.json(data);
        } catch (e) {
            next(e);
        }
    }    
}