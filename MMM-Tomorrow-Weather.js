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
            const now = new Date()
            const actual = now.getHours();
            const hour_prevs = [
                {
                    day: 0,
                    hour: actual
                },
                {
                    day: Math.floor((actual + 3) / 24),
                    hour: (actual + 3) % 24
                },
                {
                    day: Math.floor((actual + 6) / 24),
                    hour: (actual + 6) % 24
                }
            ]
            for (let i = 0; i < 3; i++) {
                var wrapper = document.createElement("div");      
                wrapper.classList.add("hourly_forecast")
                const first = document.createElement("div")
                first.classList.add("first")
                const text = document.createElement("p")
                text.innerText = i === 0 ? "Aktuell" : i === 1 ? "+3h" : "+6h"
                const img = document.createElement("img")
                // img.src = `https:${this.weather.forecast.forecastday[hour_prevs[i].day].hour[hour_prevs[i].hour].condition.icon}`
                // img.src = "/MMM-Tomorrow-Weather/regentropfen.png"
                img.src = `${get_weather_icon(this.weather.forecast.forecastday[hour_prevs[i].day].hour[hour_prevs[i].hour].condition.text)}`
                first.appendChild(text) 
                first.appendChild(img)
                const second = document.createElement("div")
                second.classList.add("params")
                const temperature = document.createElement("div")
                temperature.classList.add("item")
                const t_description = document.createElement("p")
                t_description.innerText = `${this.weather.forecast.forecastday[hour_prevs[i].day].hour[hour_prevs[i].hour].temp_c} °C`
                temperature.appendChild(t_description)
                const rain_precip = document.createElement("div")
                rain_precip.classList.add("item")
                const r_description = document.createElement("p")
                r_description.innerText = `${this.weather.forecast.forecastday[hour_prevs[i].day].hour[hour_prevs[i].hour].chance_of_rain}%`
                const r_img = document.createElement("img")
                r_img.classList.add("small")
                r_img.src = "/MMM-Tomorrow-Weather/regentropfen.png"
                rain_precip.appendChild(r_img)
                rain_precip.appendChild(r_description)
                const uv_index = document.createElement("div")
                uv_index.classList.add("item")
                const u_description = document.createElement("p")
                u_description.innerText = `UV: ${Math.round(this.weather.forecast.forecastday[hour_prevs[i].day].hour[hour_prevs[i].hour].uv)}`
                uv_index.appendChild(u_description)
                const air_humidity = document.createElement("div")
                air_humidity.classList.add("item")
                const a_description = document.createElement("p")
                a_description.innerText = `${this.weather.forecast.forecastday[hour_prevs[i].day].hour[hour_prevs[i].hour].humidity}`
                air_humidity.appendChild(a_description)
                second.appendChild(temperature)
                second.appendChild(rain_precip)
                second.appendChild(uv_index)
                second.appendChild(air_humidity)
                wrapper.appendChild(first)
                wrapper.appendChild(second)
                container.appendChild(wrapper)
            }

            // var daily_container = document.createElement("div");
            // daily_container.classList.add("daily_forecast_container");
            // for (let i = 1; i < 3; i++) {
            //     var wrapper = document.createElement("div");
            //     wrapper.classList.add("daily_forecast")
            //     const header = document.createElement("p")
            //     header.classList.add("header")
            //     header.innerText = i === 1 ? "Morgen" : "Übermorgen"
            //     const first_container = document.createElement("div")
            //     first_container.classList.add("first")
            //     const first = document.createElement("img")
            //     first.src = `https:${this.weather.forecast.forecastday[i].day.condition.icon}`
            //     first_container.appendChild(first)
            //     const second = document.createElement("div")
            //     second.classList.add("second")
            //     const temp = document.createElement("p")
            //     temp.innerText = `${this.weather.forecast.forecastday[i].day.mintemp_c} - ${this.weather.forecast.forecastday[i].day.maxtemp_c} °C`
            //     const uv = document.createElement("p")
            //     uv.innerText = `UV: ${Math.round(this.weather.forecast.forecastday[i].day.uv)}`
            //     const rain_container = document.createElement("div")
            //     rain_container.style.display = "flex"
            //     rain_container.style.align_items = "center"
            //     rain_container.style.justifyContent = "center"
            //     const rain = document.createElement("p")
            //     rain.innerText = `${this.weather.forecast.forecastday[i].day.daily_chance_of_rain}%`
            //     const r_img = document.createElement("img")
            //     r_img.classList.add("small")
            //     r_img.src = "/MMM-Tomorrow-Weather/regentropfen.png"
            //     rain_container.appendChild(r_img)
            //     rain_container.appendChild(rain)
            //     second.appendChild(temp)
            //     second.appendChild(uv)
            //     second.appendChild(rain_container)
            //     wrapper.appendChild(header)
            //     wrapper.appendChild(first_container)
            //     wrapper.appendChild(second)
            //     daily_container.appendChild(wrapper)
            // }
            // container.appendChild(daily_container)            
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