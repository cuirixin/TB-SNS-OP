
module.exports = {
    port: 3000,
    mysql : {
        host: '127.0.0.1',
        password: '',
        user: '',
        port: ''
    },
    mongodb_url : {
        main: 'mongodb://127.0.0.1:27017/tubban_sns',
        op: 'mongodb://127.0.0.1:27017/tubban_sns_op'
    },
    mongodb : {
        'host': '127.0.0.1',
        'port': 27017,
    },
    rest_client : {
        options: {
            url: 'http://127.0.0.1:9999',
            version: '1.0.0'
        }
    },
};

global.Sys =new function(){
    var me=this;
    this.cont = {
        IMG_HOST : "http://test-img.91yummy.com",
        IMG_UPLOAD_HOST : "http://123.57.92.30:6161"
    }
    
};
