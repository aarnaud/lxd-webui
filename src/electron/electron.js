'use strict';
var http = require('http');
var path = require('path');
var fs = require('fs');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
const {crashReporter} = require('electron');

//WARNING: INSECURE MODE
app.commandLine.appendSwitch("ignore-certificate-errors");

crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function() {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900 ,
        icon: __dirname + '/lxd-logo.png',
        'node-integration': false
    });

    var server = http.createServer(requestHandler).listen(8907);

    mainWindow.loadURL('http://localhost:8907/');
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.setTitle(app.getName());
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
        server.close();
    });
});

function requestHandler(req, res) {
    var
        file    = req.url == '/' ? '/index.html' : req.url,
        root    = __dirname + '/www',
        page404 = root + '/index.html';

    getFile((root + file), res, page404);
}

function getFile(filePath, res, page404) {

    fs.exists(filePath, function(exists) {
        if(exists) {
            fs.readFile(filePath, function(err, contents) {
                if(!err) {
                    res.end(contents);
                } else {
                    console.dir(err);
                }
            });
        } else {
            fs.readFile(page404, function(err, contents) {
                if(!err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    console.dir(err);
                }
            });
        }
    });
}