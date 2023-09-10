const NodeHelper = require('node_helper')
var request = require('request')
const Log = require('logger')

module.exports = NodeHelper.create({
    start: function() {
        console.log('Starting node helper: ' + this.name)
    },
    getWeather: function(payload) {
        var that = this;
        this.url = `https://api.tomorrow.io/v4/weather/forecast?location=${payload.lat},${payload.lon}&apikey=${payload.api_key}`
        Log.info(this.url)
        request({
            url: this.url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }, (error, response, body) => {
            var result = null;
            Log.log(result)
            Log.log(body)
            Log.error(error)
            if(!error && response.statusCode == 200) {
                result = JSON.parse(body);
            } else {
                result = null
            }
            that.sendSocketNotification('GOT-WEATHER', result)
        })
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'GET-WEATHER') {
            this.getWeather(payload)
        }
    }
})