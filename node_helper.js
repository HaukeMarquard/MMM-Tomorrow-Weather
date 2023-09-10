const NodeHelper = require('node_helper')
var axios = require('axios')
const Log = require('logger')

module.exports = NodeHelper.create({
    start: function() {
        console.log('Starting node helperrrr: ' + this.name)
        console.log('Hihihi')
        Log.log('Starting node helperrrriiirrrr: ' + this.name)
    },
    getWeather: function(payload) {
        var that = this;
        this.url = `https://api.tomorrow.io/v4/weather/forecast?location=${payload.lat},${payload.lon}&apikey=${payload.api_key}`
        Log.info(this.url)
        axios.get(this.url)
            .then(response => console.log(response.data))
            .then(taht.sendSocketNotification('GOT-WEATHER', response.data))
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification == 'GET_WEATHER') {
            this.getWeather(payload)
        }
    }
})