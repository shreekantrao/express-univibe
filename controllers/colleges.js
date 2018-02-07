const colleges = require('../models/colleges');
const courses = require('../models/courses');

module.exports = {

    getSiteHeader: async (req, res, key, next) => {
        // let host = req.get('host');
        // console.log(req.get('host'));
        // console.log(req.baseUrl);
        // console.log(req.subdomains);
        // console.log(req.headers);
        
        let domain = req.headers.host.replace('www.', '');
        let subDomain = domain.split('.');
        let query = {};
        
        if (domain.indexOf(key) > -1) {
            if (subDomain.length > 2) {
                subDomain = subDomain[0];
            } else {
                subDomain = "community";
            }
            query = { "slug": subDomain };
        } else {
            query = { "domain": domain.split(':')[0] };
        }
        // console.log(query);

        try {
            let data = await colleges.getSiteHeader(query);
            // console.log('Controller ',data);

            if (data.data === null) {
                // console.log('404 page');
                return res.redirect('404 page');
            }
            if ( (domain.indexOf(key) > -1) && (data.data.domain) && (data.data.domain !== '') ){
                return res.redirect('http://www.'+data.data.domain+':3000');
            }
            // if( typeof req.cookies['sitecode'] == 'undefined'){
            //   console.log('sitecode');
            
            // ############################################################
            //          this is global variable for Site details
                            siteHeader = data.data;
            // ############################################################

            res.cookie('siteHeader', data.data, {
               maxAge: 3 * 60 * 60 * 1000, // 3 hours
            // httpOnly: true, // http only, prevents JavaScript cookie access
            // secure: true // cookie must be sent over https / ssl
            });
            // }else{
            //   let sitecode = req.cookies['sitecode'];
            //   console.log(sitecode);
            // }

            next();
        } catch (e) {
            next(e);
        }

        //  --------------------------------------
        // https://askubuntu.com/questions/150135/how-to-block-specific-domains-in-hosts-file/150180#150180
        // We have used dnsmasq to route all sub-domains to our site.
        //  --------------------------------------


        
    },

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
            data["pagesize"] = pageSize;
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
                console.log('Form not filled.');
                return res.redirect('/colleges/add');
            }    

            // Delete domain becuase DB unique cant insert empty string ('')
            if ( req.body.domain === '' ) delete req.body.domain;

            let data = await colleges.createNewCollege(req.body)
            console.log('Data from model ',data);
            if (!data.success) {
                let notify = [];
                notify.push({ title: "Error", type: "error", text: "Unable to create new college." });
                req.session.notify = notify;
                return res.redirect('/colleges/add');
            }
            let notify = [];
            notify.push({ title: "Success", type: "success", text: "New college successfully created." });
            req.session.notify = notify;
            res.redirect('/colleges/edit/' + data.slug );
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
            setTimeout(() => {
                // res.send((check.data) ? '"Already taken."' : true);
                res.json( data.name ? 'College already exist.' : data.slug ? 'Slug already exist.' : true);
            }, 2000);
        } catch (e) {
            next(e);
        }
    },

    checkDomainAvailable: async(req, res, next) => {
        try {
            let domain = req.body.domain;
            // domain = domain.replace('www.', '').replace('http://', '');
            // console.log('domain- ',domain);
            let data = await colleges.checkDomainAvailable(domain, req.body.slug)
            // console.log('Controller (domain) - ',data);
            if (!data.success) {
                let notify = [];
                notify.push({ title: "Notification", type: "notice", text: "Unable to check. Please try later." });
                req.session.notify = notify;
                return res.json({ success: false, msg: 'Unable to check. Please try later.' });
            }
            // let notify = [];
            // notify.push({ title: "Notification", type: "notice", text: "College found." });
            // req.session.notify = notify;
            setTimeout(() => {
                // res.send((check.data) ? '"Already taken."' : true);
                res.json(( !data.count ) ? true : 'Domain already exist.');
            }, 2000);
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
    },    

    getBatchNCourses: async (req, res, next) => {
        try {
            let db_slug = req.cookies['siteHeader'].db_slug;
            
            let course = await courses.getDropDownCourseList(db_slug);
            // console.log('course', course);
            let year = await colleges.getEstablishmentYear(db_slug);
            // console.log('year', year);
            
            if( !(course.success && year.success) )
                return res.json(false);
            if( course.courses.length==0 && year.year )
                return res.json(false);
            let data = {};
            data["course"] = course;
            data['year'] = year;
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}