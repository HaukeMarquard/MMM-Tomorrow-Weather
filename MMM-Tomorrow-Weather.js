Module.register("MMM-Tomorrow-Weather", {
    defaults: {
        updateInterval: 10 * 60 * 1000, // every 10 minutes
        text: "Tomorrow's Weather",
        lat: '',
        lon: '',
        api_key: '',
    },
    start: function() {
        Log.info('Starting Module: ' + this.name);
        this.weather = null;
        this.sheduleUpdate();
    },
    getStyles: function() {
        return ["MMM-Tomorrow-Weather.css"];
    },
    getWeather: function() {
        this.sendSocketNotification("GET_WEATHER");
    },
    processWeather: function(data) {
        this.weather = data;
        //Datenverarbeitung
        this.updateDom();
    },
    getDom: function() {
        if(this.weather == null) {
            var wrapper = document.createElement("div");
            wrapper.innerHTML = "Loading...";
            return wrapper;
        } else {
            var wrapper = document.createElement("div")
            wrapper.innerHTML = this.weather.timelines.hourly[0].time
            return wrapper;
        }
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_RESULT") {
            this.processWeather(payload);
            this.updateDom();
        }
    },
    sheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.getWeather();
        }, this.config.updateInterval);
        self.getWeather();
    },
});