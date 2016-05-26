'use strict';
var http = require('http');
var path = require('path');
var fs = require('fs');
// Module to control application life.
const electron = require('electron');
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
// Module to reporte application crash
const {crashReporter} = electron;

const {dialog} = electron;

// crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function() {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    //WARNING: INSECURE MODE
    //TODO: ask with dialog
    callback(true);
});

app.on('select-client-certificate', (event, webContents, url, list, callback) => {
    event.preventDefault();
    var crtNames = [];
    list.forEach(function (element, index, array) {
        crtNames.push(element.issuerName);
    });
    var choice = dialog.showMessageBox({
        type: "question",
        title: "Select authentification certificate",
        message: "Please select your authentification certificate.",
        detail: "If you don't have certificate you must import this.",
        buttons: crtNames
    });
    callback(list[choice]);
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900 ,
        icon: __dirname + '/lxd-logo.png',
        'node-integration': false
    });

    var crtFiles = dialog.showOpenDialog({
        title: "Select authentification certificate",
        properties: ['openFile'],
        filters: [
            {name: 'SSL Client Certificate', extensions: ['p12', 'pfx']}
        ]
    });

    if(crtFiles){
        app.importCertificate({
            'certificate': crtFiles[0],
            'password': ''
        }, function(result) {
            console.log(result);
        });
    }


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