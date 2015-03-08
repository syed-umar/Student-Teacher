var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


module.exports = function(app) {

    /*
     * Upload file
     */
    app.post('/uploadwav', multipartMiddleware, function(req, res) {

        // console.log(req.files); res.end();
        var file = req.files.blob;
        var fs = require('fs');
        var savePath = './public/uploads/';

        // console.log(req.files);

        fs.readFile(file.path, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                fs.writeFile(savePath + 'sound.wav', data, function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('saved');
                    }
                });
            }

        });
    });
}
