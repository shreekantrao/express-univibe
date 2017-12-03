var companies = require('../models/companies');

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

            let data = await companies.getStatusList(pageSize, skip, sortby, orderby, query)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'companies not found'
                });
            }
            data["pageSize"] = pageSize;
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    createNewCompany: async(req, res, next) => {
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
                    msg: 'Company not saved'
                });
            }  
            if( body.image === '') delete body.image;  

            let data = await companies.createNewCompany(body)
            console.log('data ',data);
            if (!data.success) {
                return res.json({
                    success: false,
                    msg: 'Company not saved'
                });
            }
            res.json({
                success: true,
                msg: 'Company saved',
                data: data.data
            });
        } catch (e) {
            next(e);
        }
    },

    // ajax call
    checkCompanyNameExists: async(req, res, next) => {
        try {
            let data = await companies.checkCompanyNameExists(req.body.name, req.body.slug, req.body._id)
            console.log('Controller - ',data);
            if (!data) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Company found." });
            // req.session.notify = notify;            
            res.json(data);
        } catch (e) {
            next(e);
        }
    },

    // getCompanyData: async(req, res, next) => {
    //     try {
    //         let data = await companies.getCompanyData(req.params.companyname)
    //         // console.log('Company data - ',data);
    //         // console.log('Company data2 - ',data.data);
    //         if (!data) {
    //             // return res.json({success: false, msg: 'Company not found'});
    //             let notify = [];
    //             notify.push({ title: "Notification", type: "notice", text: "Company not found." });
    //             req.session.notify = notify;
    //             return res.redirect('/companies/list');
    //             // return res.render('page', {"page_Code":"companies","page_Title":"Company Network", "data":{success: false, msg: 'Company not found'}});
    //         }
    //         res.render('page', { "page_Code": "company-edit", "page_Title": "Profile", "data": data.data });
    //     } catch (e) {
    //         next(e);
    //     }
    // },

    savecompany: async(req, res, next) => {
        try {
            let data = await companies.savecompany(req.body)
            console.log('Company data - ',data);
            // console.log('Company data2 - ',data.data);
            if (!data) {
                // return res.json({success: false, msg: 'Company not found'});
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Company not found." });
                req.session.notify = notify;
                return res.redirect('/companies/list');
                // return res.render('page', {"page_Code":"companies","page_Title":"Company Network", "data":{success: false, msg: 'Company not found'}});
            }
            res.json(data);
        } catch (e) {
            next(e);
        }
    }    
}