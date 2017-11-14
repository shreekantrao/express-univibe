module.exports = {
  //database: 'mongodb://brad:brad@ds121190.mlab.com:21190/meanauthapp',   //prod
  mongodb: {
    database: 'mongodb://localhost:27017/meanauth',    //dev
    secret: 'yoursecret'
  },
  google: {
    clientID: '550098653161-nlg813sql6gj4brct2u4qtam4a1f70ed.apps.googleusercontent.com',
    clientSecret: 'LkB2PYCdrZE8GNU90H4MHJVm'
  },
  session: {
    cookieKey: 'sess_univibe'
  }
}
