var companies = require('../models/companies');

module.exports = {

    getCompanyList: async(req, res, next) => {
        // console.log('controller userslist');
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let pageSize = 6;

            let skip = parseInt(req.params.page_no);
            if (isNaN(skip)) skip = 1;
                skip = (skip - 1) * pageSize;
            if (skip < 0) skip = 0;

            var query = {};

            // if (typeof alphabet != 'undefined') {
            //     var regexp = new RegExp("^" + alphabet);
            //     // console.log("regexp- "+regexp);
            //     query["fullname"] = regexp;
            // }

            let sortby = req.query.sort;
            if (typeof sortby == 'undefined')
                sortby = "created";

            let orderby = -1;

            let data = await companies.getCompanyList(pageSize, skip, sortby, orderby, query, db_slug)
            // console.log('data from model ',data);
            if (!data) {
                return res.json({
                    success: false,
                    msg: 'companies not found'
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
    checkCompanyNameExists: async(req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let data = await companies.checkCompanyNameExists(req.body.name, req.body.slug, db_slug)
            // console.log('Controller - ',data);
            if (!data.success) {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                // req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "Company found." });
            // req.session.notify = notify;  
            setTimeout(() => {
                res.json( data.name ? 'Company already exist.' : true );
            }, 2000);          
        } catch (e) {
            next(e);
        }
    },

    createNewCompany: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            // console.log('check');
            let body = req.body;
            if (body.name === '') {
                // let notify = [];
                // notify.push({ title: "Notification", type: "notice", text: "Your form is not properly filled." });
                // req.session.notify = notify;
                console.log('Form not filled.');
                return res.json({
                    success: false,
                    msg: 'Your form is not properly filled.'
                });
            }
            if (body.image === '') delete body.image;

            let data = await companies.createNewCompany(body, db_slug)
            // console.log('data ', data);
            // if (!data.success) {
            //     return res.json({
            //         success: false,
            //         msg: 'Company not saved'
            //     });
            // }
            delete data.data._id;
            setTimeout(() => {
                res.json({ success: data.success, msg: data.msg, data: data.data });
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    updateCompany: async(req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;

            let data = await companies.updateCompany(req.body, db_slug)
            // console.log('Company data 1 - ',data);

            // if (!data.success) {
            //     // return res.json({success: false, msg: 'Company not found'});
            //     let notify = [];
            //     notify.push({ title: "Update fail", type: "error", text: data.msg });
            //     // req.session.notify = notify;
            //     // return res.redirect('/companies/list');
            //     return res.json(notify);
            //     // return res.render('page', {"page_Code":"companies","page_Title":"Company Network", "data":{success: false, msg: 'Company not found'}});
            // }
            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    deleteCompany: async(req, res, next) =>{
        try{
            let db_slug = req.cookies['siteHeader'].db_slug;

            if (!req.body.slug) return res.json(false);

            let data = await companies.deleteCompany(req.body.slug, db_slug);
            // console.log('data from model', data);

            setTimeout(() => {
                res.json(data);
            }, 2000);
        } catch (e) {
            next(e);
        }
    }
}