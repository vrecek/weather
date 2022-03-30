import React from 'react';
import './index.css';
import { useRef, useEffect } from 'react';

import Weather from './Weather';
import { TemperatureDetails } from './Weather';
import load from './loading.gif'

function App() {
  let icon:any = useRef<HTMLElement>(null)
  let weatherCont:any = useRef<HTMLHeadingElement>(null)
  let tempCont:any = useRef<HTMLHeadingElement>(null)
  let cityCont:any = useRef<HTMLHeadingElement>(null)
  let countryCont:any = useRef<HTMLHeadingElement>(null)

  const key:string = process.env.REACT_APP_KEY as string

  const app = new Weather(key)

  let appendedGif:HTMLElement
  let timeout:any

  useEffect(() => {
    icon = icon.current
    weatherCont = weatherCont.current
    tempCont = tempCont.current
    cityCont = cityCont.current  
    countryCont = countryCont.current
  
    displayEmpty()
    console.log(key);
  }, [])

  function searchCity(e:React.KeyboardEvent) {
    const t = e.target as HTMLInputElement

    if(timeout) {
      clearTimeout(timeout)
      appendedGif.remove()
    }

    appendedGif = app.appendLoadingWheel(load, t.parentElement?.parentElement?.children[0]!)

    timeout = setTimeout(async () => {
      const info = await app.returnInfo(t.value)
      
      if(info) {
        display(info)

      }else {
        displayEmpty()
      }

      appendedGif.remove()
    }, 500);

  }

  function display(info:TemperatureDetails):void {
    icon.className = app.returnIconClass(info.weather)
    weatherCont.textContent = info.weather
    tempCont.textContent = `${ app.kelvinToCelsius(info.temp) }C`
    cityCont.textContent = `${ info.city },`
    countryCont.textContent = info.country
  }

  function displayEmpty():void {
    icon.className = ''
    weatherCont.textContent = ''
    tempCont.textContent = `Enter city name`
    cityCont.textContent = ``
    countryCont.textContent = ''
  }

  function clear(e:React.MouseEvent) {
    const t = e.target as HTMLElement
    const input = t.parentElement!.children[0] as HTMLInputElement
  
    input.value = ''
    displayEmpty()
  }

  return (
    <>
      <main>
          <section className="temp">
            <h5>Current temperature</h5>
            <h1 ref={ tempCont }>35C</h1>
          </section>

          <section className="location">
            <h2 ref={ cityCont } className="city">Katowice,</h2>
            <h2 ref={ countryCont } className="country">Poland</h2>
          </section>

          <section className="weather">
            <i ref={ icon } className="fa fa-cloud-rain"></i>
            <h4 ref={ weatherCont }>Rain</h4>
          </section>
      </main>

      <section className="search">
          <input onKeyDown={ searchCity } spellCheck='false' placeholder="Search city..." type="text" />
          <i onClick={ clear } className="fa fa-ban"></i>
      </section>
    </>
  );
}

export default App;
