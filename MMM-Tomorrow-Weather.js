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
        this.weather = null
        
        this.sheduleUpdate();
    },
    getStyles: function() {
        return ["MMM-Tomorrow-Weather.css"];
    },
    getWeather: function() {
        this.sendSocketNotification("GET_WEATHER", {
            lat: this.config.lat,
            lon: this.config.lon,
            api_key: this.config.api_key,
        });
        this.updateDom()
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
            var wrapper = document.createElement("div");
            for(let i = 0; i < 4; i++) {
                const p = document.createElement("p")
                const time = new Date(this.weather.timelines.hourly[3*i].time)
                p.innerText = `${time.toLocaleTimeString()}`
                const p2 = document.createElement("p")
                p2.innerText = `Temp: ${Math.round(this.weather.timelines.hourly[3*i].values.temperature * 10)/10}, Gefühlte Temp: ${Math.round(this.weather.timelines.hourly[3*i].values.temperatureApparent*10)/10}, UV-Index: ${Math.round(this.weather.timelines.hourly[3*i].values.uvIndex)}, Regenmenge(mm): ${this.weather.timelines.hourly[3*i].values.rainIntensity}`
                wrapper.appendChild(p)
                wrapper.appendChild(p2)
            }
            for(let i = 0; i < 3; i++) {
                const p = document.createElement("p")
                const time = new Date(this.weather.timelines.daily[i].time)
                p.innerText = `${time.toLocaleDateString()}`
                const p2 = document.createElement("p")
                p2.innerText = `Min: ${Math.round(this.weather.timelines.daily[i].values.temperatureMin * 10)/10}, Max: ${Math.round(this.weather.timelines.daily[i].values.temperatureMax*10)/10}, UV-Index: ${Math.round(this.weather.timelines.daily[i].values.uvIndexMfax)}, Regenmenge(mm): ${this.weather.timelines.daily[i].values.rainIntensityMax}`   
                wrapper.appendChild(p)
                wrapper.appendChild(p2)
            }
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

/*
for(let i = 0; i < 4; i++) {
                const time = new Date(this.weather.timelines.hourly[3*i].time).toLocaleTimeString()
                Log.info(time)
                wrapper.appendChild(document.createElement("p").innerText = time)
                wrapper.appendChild(document.createElement("p").innerText = `Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperature)}`)
                wrapper.appendChild(document.createElement("p").innerText = `Gefühlte Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperatureApparent)}`)
                wrapper.appendChild(document.createElement("p").innerText = `UV-Index: ${Math.round(this.weather.timelines.hourly[3*i].uvIndex)}`)
                wrapper.appendChild(document.createElement("p").innerText = `Regenmenge(mm): ${this.weather.timelines.hourly[3*i].rainIntensity}`)
                
            }
*/