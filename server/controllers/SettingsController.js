var Settings = require('../models/Settings');

var SettingsController = {};

/**
 * Get the open and close time for registration.
 * @param  {Function} callback args(err, times : {timeOpen, timeClose})
 */
SettingsController.getTime = function(callback){
    Settings.getTime(callback);
};

SettingsController.updateTimes = function(close, callback){
    Settings.update(
        {
            id: 0
        },
        {
            $SET: {
                timeClose: close
            }
        },
        function(err, res){
            if(err) {
                return callback({
                    message: err
                });
            }
            else {
                return callback(null, res);
            }
    })
};

module.exports = SettingsController;