// Create web server
// Run: node comments.js
// Open browser: http://localhost:3000

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if (pathname === '/') {
        pathname = 'index.html';
    }
    if (pathname === '/index.html') {
        var filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, 'utf-8', function(err, data) {
            if (err) {
                console.error(err);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        });
    } else if (pathname === '/addComment') {
        var comment = urlObj.query;
        comments.addComment(comment, function(err) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Server error');
            } else {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Success');
            }
        });
    } else if (pathname === '/getComments') {
        comments.getComments(function(err, data) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Server error');
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data));
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Page not found');
    }
});

server.listen(3000, function() {
    console.log('Server is listening at port 3000');
});