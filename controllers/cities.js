var cities = require('../models/cities');

module.exports = {

    getCityList: async(req, res, next) => {
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

            let data = await cities.getCityList(pageSize, skip, sortby, orderby, query)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'cities not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createNewCity: async(req, res, next) => {
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
                    msg: 'City not saved'
                });
            }  
            if( body.image === '') delete body.image;  

            let data = await cities.createNewCity(body)
            console.log('data ',data);
            if (!data.success) {
                return res.json({
                    success: false,
                    msg: 'City not saved'
                });
            }
            res.json({
                success: true,
                msg: 'City saved',
                data: data.data
            });
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    checkCityNameExists: async(req, res, next) => {
        try {
            let data = await cities.checkCityNameExists(req.body.name, req.body.slug, req.body._id)
            console.log('Controller - ',data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "City found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // getCityData: async(req, res, next) => {
    //     try {
    //         let data = await cities.getCityData(req.params.cityname)
    //         // console.log('City data - ',data);
    //         // console.log('City data2 - ',data.data);
    //         if (!data) {
    //             // return res.json({success: false, msg: 'City not found'});
    //             let notify = [];
    //             notify.push({ title: "Notification", type: "notice", text: "City not found." });
    //             req.session.notify = notify;
    //             return res.redirect('/cities/list');
    //             // return res.render('page', {"page_Code":"cities","page_Title":"City Network", "data":{success: false, msg: 'City not found'}});
    //         }
    //         res.render('page', { "page_Code": "city-edit", "page_Title": "Profile", "data": data.data });
    //     } catch (e) {
    //         next(e);
    //     }
    // },

    savecity: async(req, res, next) => {
        try {
            let data = await cities.savecity(req.body)
            console.log('City data - ',data);
            // console.log('City data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'City not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "City not found." });
                req.session.notify = notify;
                return res.redirect('/cities/list');
                // return res.render('page', {"page_Code":"cities","page_Title":"City Network", "data":{success: false, msg: 'City not found'}});
            }
            res.json(data);
        } catch (e) {
            next(e);
        }
    }    
}