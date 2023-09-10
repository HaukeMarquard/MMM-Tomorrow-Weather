Module.register("MMM-Tomorrow-Weather", {
    defaults: {
        updateInterval: 1 * 60 * 1000, // every 10 minutes
        text: "Tomorrow's Weather",
        lat: '',
        lon: '',
        api_key: '',
    },
    start: function() {
        Log.info('Starting Module: ' + this.name);
        this.weather = null;
        this.getWeather();
        this.sheduleUpdate();
    },
    getStyles: function() {
        return ["MMM-Tomorrow-Weather.css"];
    },
    getWeather: function() {
        Log.log("Getting Weather")
        Log.log(this.lat)
        Log.log(this.lon)
        this.sendSocketNotification("GET_WEATHER", {
            lat: this.config.lat,
            lon: this.config.lon,
            api_key: this.config.api_key,
        });
    },
    processWeather: function(data) {
        this.weather = data;
        //Datenverarbeitung
        this.updateDom()
    },
    getDom: function() {
        if(this.weather == null) {
            var wrapper = document.createElement("div");
            wrapper.innerHTML = "Loading...";
            return wrapper;
        } else {
            var wrapper = document.createElement("div")
            for(let i = 0; i < 4; i++) {
                const time = new Date(this.weather.timelines.hourly[3*i].time).toLocaleTimeString()
                Log.info(time)
                wrapper.appendChild(document.createElement("p").innerText = time)
                wrapper.appendChild(document.createElement("p").innerText = `Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperature)}`)
                wrapper.appendChild(document.createElement("p").innerText = `Gefühlte Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperatureApparent)}`)
                wrapper.appendChild(document.createElement("p").innerText = `UV-Index: ${Math.round(this.weather.timelines.hourly[3*i].uvIndex)}`)
                wrapper.appendChild(document.createElement("p").innerText = `Regenmenge(mm): ${this.weather.timelines.hourly[3*i].rainIntensity}`)
                
            }
            return wrapper;
        }
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_RESULT") {
            Log.info("Hier kam das Wetter an")
            Log.info(payload)
            this.processWeather(payload);
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