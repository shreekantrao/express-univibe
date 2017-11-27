var industries = require('../models/industries');

module.exports = {

    getIndustryList: async(req, res, next) => {
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

            let data = await industries.getIndustryList(pageSize, skip, sortby, orderby, query)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'industries not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createNewIndustry: async(req, res, next) => {
        try {
            // console.log('check');
            let body = req.body;
            if(body.name===''||body.slug===''){
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                req.session.notify = notify;
                console.log('Form not filled.');
                return res.json({
                    success: false,
                    msg: 'Industry not saved'
                });
            }  
            if( body.image === '') delete body.image;  

            let data = await industries.createNewIndustry(body)
            console.log('data ',data);
            if (!data.success) {
                return res.json({
                    success: false,
                    msg: 'Industry not saved'
                });
            }
            res.json({
                success: true,
                msg: 'Industry saved',
                data: data.data
            });
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    checkIndustryNameExists: async(req, res, next) => {
        try {
            let data = await industries.checkIndustryNameExists(req.body.name, req.body.slug, req.body._id)
            console.log('Controller - ',data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Industry found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // getIndustryData: async(req, res, next) => {
    //     try {
    //         let data = await industries.getIndustryData(req.params.industryname)
    //         // console.log('Industry data - ',data);
    //         // console.log('Industry data2 - ',data.data);
    //         if (!data) {
    //             // return res.json({success: false, msg: 'Industry not found'});
    //             let notify = [];
    //             notify.push({ title: "Notification", type: "notice", text: "Industry not found." });
    //             req.session.notify = notify;
    //             return res.redirect('/industries/list');
    //             // return res.render('page', {"page_Code":"industries","page_Title":"Industry Network", "data":{success: false, msg: 'Industry not found'}});
    //         }
    //         res.render('page', { "page_Code": "industry-edit", "page_Title": "Profile", "data": data.data });
    //     } catch (e) {
    //         next(e);
    //     }
    // },

    saveindustry: async(req, res, next) => {
        try {
            let data = await industries.saveindustry(req.body)
            console.log('Industry data - ',data);
            // console.log('Industry data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'Industry not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Industry not found." });
                req.session.notify = notify;
                return res.redirect('/industries/list');
                // return res.render('page', {"page_Code":"industries","page_Title":"Industry Network", "data":{success: false, msg: 'Industry not found'}});
            }
            res.json(data);
        } catch (e) {
            next(e);
        }
    }    
}