var network = require('../models/network');

module.exports = {

    userslist : async (req, res, next) => {
            // console.log('controller userslist');
        try {

            pageSize = 6;
            
            skip = parseInt(req.params.page_no);
            if(isNaN(skip)) skip = 1;
            skip = (skip-1)*pageSize;
            if(skip < 0) skip = 0;

            alphabet = req.params.alphabet;
            // console.log("alphabet= "+alphabet);

            var query = {};

            if( typeof alphabet != 'undefined' ) {
                var regexp = new RegExp("^"+ alphabet);
                // console.log("regexp- "+regexp);
                query["fullname"] = regexp;
            }
            
            sortby = req.query.sort;
            if(typeof sortby == 'undefined')
            sortby="fullname";
            orderby = 1;
            
            // console.log("limit- "+pageSize);
            // console.log("skip- "+skip);
            // console.log("sort- "+sortby);
            // console.log("order- "+orderby);

            let data = await network.getUserList(pageSize, skip, sortby, orderby, query)
            if(!data) {
                return res.json({success: false, msg: 'Users not found'});
            }
            res.json(data);
        } catch(e) {
            next(e);
        }
    },

    profileData : async (req, res) => {
            // console.log('controller userslist');
        try 
        {
            slug = req.params.slug;
            // console.log('slug - '+slug);
            let data = await network.getProfileData(slug)
            // console.log("Con data ="+JSON.stringify(data.data));
            if(!data) {
                return {success: false, msg: 'Users not found'};
            }
            // return data;
            res.render('page', {"page_Code":"profile","page_Title":"Profile", "data":data.data});
        } catch(e) {
            next(e);
        }
    }
}    