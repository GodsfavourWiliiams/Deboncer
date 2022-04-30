import './App.css';
import React, { useState,useEffect } from 'react';
import ReactQuill from 'react-quill';
import debounce from './helper'
import 'react-quill/dist/quill.snow.css';

function App() {
  const [editorBody,setEditorBody] = useState('')
  const [storedSaveTime,setStoredSaveTime] = useState('')

  const save = () => {
    localStorage.setItem('editorSave',editorBody)
    const currentTime = new Date().toUTCString();
    localStorage.setItem('savedDateTime', currentTime)
  }

  const getTwelveHourFormat = (hours) => {
    if (hours === 0) {
      return 12
    } else if (hours > 12) {
      return hours - 12
    } else {
      return hours
    }
  }

  async function getSavedTime() {
    const parsedDate = await localStorage.getItem('savedDateTime').toLocaleString()
    const savedDate = new Date(parsedDate)
    const savedHours = savedDate.getHours()
    const localMeridian = savedHours < 12 ? "AM" : "PM"
    const adjustedHours = getTwelveHourFormat(savedHours) 
    const localTimeString = (savedDate.getMonth()+1 + "/"
    + savedDate.getDate() + "/" 
    + savedDate.getFullYear() + " at "  
    + adjustedHours + ":"  
    + savedDate.getMinutes() + " " 
    + localMeridian + ".")
    return await localTimeString
  }

  function load() {
    const storedData = localStorage.getItem('editorSave')
    if (storedData) {
      setEditorBody(storedData)
      // parseSavedTime(parsedDate)
      getSavedTime()
        .then(dateText => setStoredSaveTime(dateText))
        .catch(error => console.log(error))
    }
  }

  const handleTyping = debounce((value) => {
    setEditorBody(value)
    save()
    getSavedTime()
    .then(dateText => setStoredSaveTime(dateText))
    .catch(error => console.log(error))
  }, 1500)

  window.addEventListener("onload", () => {
    save()
  })

  // effects on window load and window close
  useEffect(() => {
    load()
   // eslint-disable-next-line
  }, [])

  const lastSave = storedSaveTime && (<strong>Last note saved {storedSaveTime}</strong>)

  return (
    <div>
      <header>
        <div className='header__hero'>
          <h1>React Debouncer</h1>
        </div>
        <p><span>{lastSave} </span>The note will save automatically when the window closes.</p>
      </header>
      <main>
        <ReactQuill value={editorBody}  onChange={handleTyping}/>
        inp
      </main>
    </div>
  );
}

export default App;
