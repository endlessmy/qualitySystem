var path = require('path');
var fs = require('fs');
var mock = require('mockjs');
var app = require('express')();
var _assign = require('lodash.assign');
var port = process.argv.slice(2)[0] || 8080;
var server = app.listen(port, function() {
    console.info('Mock server is listening at ' + port);
});

const prefix = '';

// var api = {};
// var apiPath = path.join(__dirname, './api.json');
// function getApis() {
//     fs.readFile(apiPath, 'utf-8', function(err, content) {
//         api = JSON.parse(content);
//     });
// }

let api = {};
var apiPath = path.join(__dirname, './api/');

function getApis() {
    fs.readdir(apiPath, 'utf-8', (err, files) => {
        if (err) {
            return console.error(err);
        }
        api = {};

        var obj = {};
        console.log('readdir');
        console.log(files);
        files.forEach((file) => {
            // fs.readFile(apiPath + file, 'utf-8', (err, content) => {
            //     // console.log('err', err, count += 1);
            //     console.log(apiPath + file);
            //     let c = JSON.parse(content);
            //     obj = _assign(obj, c);
            // });
            let content = fs.readFileSync(apiPath + file);
            console.log(apiPath + file);
            obj = _assign(obj, JSON.parse(content));
        });

        api = obj;
    });
}

// 监听api.json变化
fs.readdir(apiPath, 'utf-8', function(err, files) {
    if (err) {
        return console.error(err);
    }

    files.forEach(function(file) {
        fs.watchFile(apiPath + file, function(curr) {
            // console.log('API is updated.', curr.mtime);
            getApis();
        });
    });
});

getApis();

// 支持callback
app.set('jsonp callback name', 'callback');
app.use(function(req, res) {
    var data;
    var delay = 0;
    for (var group in api) {
        if (
            api[group].find(function(reqData) {
                if (reqData.regexp) {
                    if (!new RegExp(reqData.url).test(req.originalUrl)) {
                        return false;
                    }
                } else if (req.originalUrl !== prefix + reqData.url) {
                    return false;
                }
                var apiRes = reqData.res;
                data = reqData.mock !== false ? mock.mock(apiRes) : apiRes;
                delay = reqData.delay || 0;
                return true;
            }) !== undefined
        ) {
            break;
        }
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.set(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, user-sessionid, request-sessionid'
    );
    data !== undefined ? setTimeout(() => res.jsonp(data), delay) : res.sendStatus(404);
});
