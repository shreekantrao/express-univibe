var colleges = require('../models/colleges');

module.exports = {

    getCollegeList: async(req, res, next) => {
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
                sortby = "registered_date";
            orderby = 1;

            // console.log("limit- "+pageSize);
            // console.log("skip- "+skip);
            // console.log("sort- "+sortby);
            // console.log("order- "+orderby);

            let data = await colleges.getCollegeList(pageSize, skip, sortby, orderby, query)
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'Colleges not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createNewCollege: async(req, res, next) => {
        try {
            let validate = req.body;
            if(validate.name===''||validate.slug===''||validate.long_name===''||validate.short_name===''){
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                req.session.notify = notify;
                console.log('Form now filled.');
                return res.redirect('/colleges/add');
            }    

            let data = await colleges.createNewCollege(req.body)
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'College not saved'
                });
            }
            res.redirect('/colleges/' + data.slug + '/edit');
        } catch (e) {
            next(e);
        }
    },

    checkCollegeNameExists: async(req, res, next) => {
        try {
            let data = await colleges.checkCollegeNameExists(req.body.name, req.body.slug)
            console.log('Controller - ',data);
            if (!data) {
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "College found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    getCollegeData: async(req, res, next) => {
        try {
            let data = await colleges.getCollegeData(req.params.collegename)
            // console.log('College data - ',data);
            // console.log('College data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'College not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "College not found." });
                req.session.notify = notify;
                return res.redirect('/colleges/list');
                // return res.render('page', {"page_Code":"colleges","page_Title":"College Network", "data":{success: false, msg: 'College not found'}});
            }
            res.render('page', { "page_Code": "college-edit", "page_Title": "Profile", "data": data.data });
        } catch (e) {
            next(e);
        }
    },

    saveCollegeData: async(req, res, next) => {
        try {
            let data = await colleges.getCollegeData(req.params.collegename)
            // console.log('College data - ',data);
            // console.log('College data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'College not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "College not found." });
                req.session.notify = notify;
                return res.redirect('/colleges/list');
                // return res.render('page', {"page_Code":"colleges","page_Title":"College Network", "data":{success: false, msg: 'College not found'}});
            }
            res.render('page', { "page_Code": "college-edit", "page_Title": "Profile", "data": data.data });
        } catch (e) {
            next(e);
        }
    }    
}