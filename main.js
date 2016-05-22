// Copyright (c) 2015 Mark Cavage. All rights reserved.

var fs = require('fs');
var path = require('path');

var getopt = require('posix-getopt');
var app = require('./app');
var config = require('./config');
//var CONST = require('./lib/CONST')


///--- Helpers

/**
 * Standard POSIX getopt-style options parser.
 *
 * Some options, like directory/user/port are pretty cut and dry, but note
 * the 'verbose' or '-v' option afflicts the log level, repeatedly. So you
 * can run something like:
 *
 * node main.js -p 80 -vv 2>&1 | bunyan  将标准信息输出路径指定为错误信息输出路径
 *
 * And the log level will be set to TRACE.
 */
function parseOptions() {
    var option;
    var opts = {};
    var parser = new getopt.BasicParser('hv:p:u:z:', process.argv);

    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {

            case 'h':
                usage();
                break;

            case 'p':
                opts.port = parseInt(option.optarg, 10);
                break;

            case 'u':
                opts.user = option.optarg;
                break;

            case 'z':
                opts.password = option.optarg;
                break;

            default:
                usage('invalid option: ' + option.option);
                break;
        }
    }

    return (opts);
}


function usage(msg) {
    if (msg) {
        console.error(msg);
    }

    var str = 'usage: ' +
        NAME +
        ' [-v] [-p port] [-u user] [-z password]';
    console.error(str);
    process.exit(msg ? 1 : 0);
}


///--- Mainline

(function main() {
    var options = parseOptions();
    // At last, let's rock and roll
    app.listen((options.port || config.port), function onListening() {
        console.info('listening at port: %s', (options.port || config.port));
    });

})();


// node /home/tubban/space/TB-SNS-RESTAPI/main.js | bunyan