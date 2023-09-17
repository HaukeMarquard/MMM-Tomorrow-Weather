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
        Log.info("Starting dingens durch hier")
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
            var container = document.createElement("div");
            // container.innerHTML = `${this.weather.forecast.forecastday[0].date}`
            const actual = 0;
            for (let i = actual; i < 3; i++) {
                var wrapper = document.createElement("div");      
                wrapper.classList.add("hourly_forecast")
                const first = document.createElement("div")
                first.classList.add("first")
                const text = document.createElement("p")
                text.innerText = i === 0 ? "Aktuell" : i === 1 ? "+3h" : "+6h"
                const img = document.createElement("img")
                img.src = `https:${this.weather.forecast.forecastday[0].hour[3*i].condition.icon}`
                first.appendChild(text) 
                first.appendChild(img)
                const second = document.createElement("div")
                second.classList.add("params")
                const temperature = document.createElement("div")
                temperature.classList.add("item")
                const t_description = document.createElement("p")
                t_description.innerText = `${this.weather.forecast.forecastday[0].hour[3*i].temp_c} °C`
                temperature.appendChild(t_description)
                const rain_precip = document.createElement("div")
                rain_precip.classList.add("item")
                const r_description = document.createElement("p")
                r_description.innerText = `${this.weather.forecast.forecastday[0].hour[3*i].chance_of_rain}`
                rain_precip.appendChild(r_description)
                const uv_index = document.createElement("div")
                uv_index.classList.add("item")
                const u_description = document.createElement("p")
                u_description.innerText = `${Math.round(this.weather.forecast.forecastday[0].hour[3*i].uv)}`
                uv_index.appendChild(u_description)
                const air_humidity = document.createElement("div")
                air_humidity.classList.add("item")
                const a_description = document.createElement("p")
                a_description.innerText = `${this.weather.forecast.forecastday[0].hour[3*i].humidity}`
                air_humidity.appendChild(a_description)
                second.appendChild(temperature)
                second.appendChild(rain_precip)
                second.appendChild(uv_index)
                second.appendChild(air_humidity)
                wrapper.appendChild(first)
                wrapper.appendChild(second)
                container.appendChild(wrapper)
            }




            // var wrapper = document.createElement("div");
            // wrapper.style.display = "flex";
            // for(let i = 0; i < 4; i++) {
            //     var wrapper_hourly = document.createElement("div");
            //     wrapper_hourly.style.display = "flex";
            //     wrapper_hourly.style.flexDirection = "column";
            //     wrapper_hourly.style.justifyContent = "center";
            //     wrapper_hourly.style.alignItems = "center";
            //     wrapper_hourly.style.border = "1px solid white";
            //     wrapper_hourly.style.borderRadius = "10px";
            //     wrapper_hourly.style.padding = "3px";
            //     wrapper_hourly.style.gap = "3px";
            //     const img = document.createElement("img")
            //     img.src = `https:${this.weather.forecast.forecastday[0].hour[3*i].condition.icon}`
            //     img.style.width = "50px";
            //     img.style.height = "50px";
            //     const p = document.createElement("p")
            //     const time = new Date(this.weather.forecast.forecastday[0].hour[3*i].time)
            //     p.innerText = `${time.toLocaleTimeString()}`
            //     // p.innerText = `Hauke`
            //     const temperature = document.createElement("p")
            //     temperature.innerText = `Temp: ${this.weather.forecast.forecastday[0].hour[3*i].temp_c}`
            //     const uvIndex = document.createElement("p")
            //     uvIndex.innerText = `UV-Index: ${Math.round(this.weather.forecast.forecastday[0].hour[3*i].uv)}`
            //     const rainIntensity = document.createElement("p")
            //     rainIntensity.innerText = `Regenchance: ${this.weather.forecast.forecastday[0].hour[3*i].chance_of_rain}`
            //     wrapper_hourly.appendChild(img)
            //     wrapper_hourly.appendChild(p)
            //     wrapper_hourly.appendChild(temperature)
            //     wrapper_hourly.appendChild(uvIndex)
            //     wrapper_hourly.appendChild(rainIntensity)
            //     wrapper.appendChild(wrapper_hourly)
            // }
            // container.appendChild(wrapper)
            // wrapper_daylies = document.createElement("div");
            // wrapper_daylies.style.display = "flex";
            // for(let i = 0; i < 3; i++) {
            //     var wrapper_daily = document.createElement("div");
            //     wrapper_daily.style.display = "flex";
            //     wrapper_daily.style.flexDirection = "column";
            //     wrapper_daily.style.justifyContent = "center";
            //     wrapper_daily.style.alignItems = "center";
            //     wrapper_daily.style.border = "1px solid white";
            //     wrapper_daily.style.borderRadius = "10px";
            //     wrapper_daily.style.padding = "3px";
            //     wrapper_daily.style.gap = "3px";
            //     const p = document.createElement("p")
            //     // p.innerText = `${this.weather.forecast.forecastday[i+1]}`
            //     const time = new Date(this.weather.forecast.forecastday[i+1].date)
            //     p.innerText = `${time.toLocaleDateString()}`
            //     const temperature = document.createElement("p")
            //     temperature.innerText = `Maxtemp: ${this.weather.forecast.forecastday[i+1].day.maxtemp_c}`
            //     const uvIndex = document.createElement("p")
            //     uvIndex.innerText = `UV-Index: ${this.weather.forecast.forecastday[i+1].day.uv}`
            //     const rainIntensity = document.createElement("p")
            //     rainIntensity.innerText = `Regenmengechance: ${this.weather.forecast.forecastday[i+1].day.daily_chance_of_rain}`
            //     wrapper_daily.appendChild(p)
            //     wrapper_daily.appendChild(temperature)
            //     wrapper_daily.appendChild(uvIndex)
            //     wrapper_daily.appendChild(rainIntensity)
            //     wrapper_daylies.appendChild(wrapper_daily)
            // }
            // container.appendChild(wrapper_daylies)

            
            return container;
        }
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_RESULT") {
            Log.log("Data kommt an")
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