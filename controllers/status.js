var status = require('../models/status');

module.exports = { 

    getStatusList: async(req, res, next) => {
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

            let data = await status.getStatusList(pageSize, skip, sortby, orderby, query)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'status not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createNewStatus: async(req, res, next) => {
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
                    msg: 'Status not saved'
                });
            }  
            if( body.image === '') delete body.image;  

            let data = await status.createNewStatus(body)
            console.log('data ',data);
            if (!data.success) {
                return res.json({
                    success: false,
                    msg: 'Status not saved'
                });
            }
            res.json({
                success: true,
                msg: 'Status saved',
                data: data.data
            });
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    changeState: async(req, res, next) => {
        try {
            let data = await status.changeState(req.body.slug, req.body.state)
            console.log('Controller - ',data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Status found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    deleteStatus: async (req, res, next) => {
        try {
            let data = await status.deleteStatus(req.body.slug)
            console.log('Controller - ', data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Status found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },
    // getStatusData: async(req, res, next) => {
    //     try {
    //         let data = await status.getStatusData(req.params.statusname)
    //         // console.log('Status data - ',data);
    //         // console.log('Status data2 - ',data.data);
    //         if (!data) {
    //             // return res.json({success: false, msg: 'Status not found'});
    //             let notify = [];
    //             notify.push({ title: "Notification", type: "notice", text: "Status not found." });
    //             req.session.notify = notify;
    //             return res.redirect('/status/list');
    //             // return res.render('page', {"page_Code":"status","page_Title":"Status Network", "data":{success: false, msg: 'Status not found'}});
    //         }
    //         res.render('page', { "page_Code": "status-edit", "page_Title": "Profile", "data": data.data });
    //     } catch (e) {
    //         next(e);
    //     }
    // },

    saveStatus: async(req, res, next) => {
        try {
            let data = await status.savestatus(req.body)
            console.log('Status data - ',data);
            // console.log('Status data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'Status not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Status not found." });
                req.session.notify = notify;
                return res.redirect('/status/list');
                // return res.render('page', {"page_Code":"status","page_Title":"Status Network", "data":{success: false, msg: 'Status not found'}});
            }
            res.json(data);
        } catch (e) {
            next(e);
        }
    }    
}