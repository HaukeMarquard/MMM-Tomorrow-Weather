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
        // this.url = `https://api.tomorrow.io/v4/weather/forecast?location=${payload.lat},${payload.lon}&apikey=${payload.api_key}`
        this.url = `https://api.weatherapi.com/v1/forecast.json?key=0f72f66586594e1c997150801231709&q=Grossenwiehe&days=4&aqi=no&alerts=no`
        Log.info(this.url)
        axios.get(this.url)
            .then(response => {
                that.sendSocketNotification('WEATHER_RESULT', response.data)
            })
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification == 'GET_WEATHER') {
            this.getWeather(payload)
        }
    }
})