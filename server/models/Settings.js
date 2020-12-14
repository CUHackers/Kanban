var dynamoose = require("dynamoose");

var schema = new dynamoose.Schema({

    id: {
        type: Number,
        default: 0,
        hashKey: true
    },

    timeOpen: {
        type: Number,
        default: 0
    },

    timeClose: {
        type: Number,
        default: Date.now() + 31104000000 // Add a year from now.
    },
})

var Settings = dynamoose.model('SettingsTable', schema);

// static methods

/**
 * find user based on email
 * @param {String} email user email
 */
Settings.methods.set("getTime", function (callback) {
    Settings.get(0, (err, res) => {

        callback(err, {
            timeOpen: res.timeOpen,
            timeClose: res.timeClose
        })
    });
});

module.exports = Settings;