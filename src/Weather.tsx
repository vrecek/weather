export interface TemperatureDetails {
   temp: number,
   weather: string,
   country: string,
   city: string
}

interface WeatherIcons {
   Rain: string,
   Snow: string,
   Clouds: string,
   Clear: string
}

enum weatherString {
   Rain = "Rain",
   Snow = "Snow",
   Clear = "Clear",
   Clouds = "Clouds"
}

export default class Weather {
   private apiKey:string
   private weatherIcons:WeatherIcons

   public constructor(apiKey:string) {
      this.apiKey = apiKey
      this.weatherIcons = {
         Rain: 'fa fa-cloud-rain',
         Snow: 'fa fa-snowflake',
         Clear: 'fa fa-cloud-sun',
         Clouds: 'fa fa-cloud'
      }
   }

   public async returnInfo(city:string):Promise<TemperatureDetails | undefined> {
      if(!city) return
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${ city }&limit=1&appid=${ this.apiKey }`)
      const data = await res.json()
      if(!data.length || !city) return

      const { lat, lon } = data[0]

      const res2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }&appid=${ this.apiKey }`)
      const data2 = await res2.json()

      return {
         temp: data2.main.temp,
         weather: data2.weather[0].main,
         country: data[0].country,
         city: data[0].name
      }
   }

   public appendLoadingWheel(gif:string, element:HTMLElement | Element):HTMLElement {
      const img = document.createElement('img')
      const figure = document.createElement('figure')

      img.src = gif
      figure.appendChild(img)

      element.appendChild(figure)

      return figure
   }

   public returnIconClass(weather:string):string {
      const weatherEnum = weatherString[weather as weatherString]
      return this.weatherIcons[weatherEnum]
   }

   public kelvinToCelsius(kelvin:number):number {
      return parseFloat((kelvin - 273.15).toPrecision(2))
   }
}