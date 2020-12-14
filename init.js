var Settings = require('./server/models/Settings');

Settings.scan().exec((err, res) => {

    if (err) {
        console.log(error);
    } else {
        if (res.count == 0) {
            var settings = new Settings;
            settings.save();
        }
    }
});