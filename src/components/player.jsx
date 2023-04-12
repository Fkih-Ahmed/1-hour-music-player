import React, { useState, useEffect } from 'react';
import '../App.css';
import ProgressBar from "@ramonak/react-progress-bar";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


function Player() {
  const [playlist, setPlaylist] = useState(null);
  const [album, setCurrentAlbum] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongNumber, setCurrentSongNumber] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('playlist.json')
      .then(response => response.json())
      .then(data => {
        setPlaylist(data);
      })
      .catch(error => {
        console.error(`Error loading file: ${error}`);
      });
  }, []);

  useEffect(() => {
    let intervalId;
    if (currentSong) {
      intervalId = setInterval(() => {
        setCurrentTime(Math.floor(currentSong.currentTime));
        setDuration(Math.floor(currentSong.duration));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [currentSong]);

  const handlePlay = () => {
    try {
      if (playlist && !currentSong) {
        const current_song_number = Math.floor(Math.random() * playlist.songs.length);
        const audio = new Audio(`music/${playlist.songs[current_song_number]}.mp3`);
        const album =  <img src={`images/${playlist.songs[current_song_number]}.jpg`} alt="album" />
        setCurrentAlbum(album);
        setCurrentSong(audio);
        setCurrentSongNumber(current_song_number);
        audio.play();
        audio.addEventListener('ended', () => {
          setCurrentSong(null);
          setCurrentSongNumber(null);
          nextSong();
        });
      }
      else{
        handleStop();
      }
    } catch (error) {
      console.error("Oopsie error while Handling Play:", error);
    }
  };

  const nextSong = () => {
    try {
      if (currentSongNumber === null) {
        handlePlay();
      } else if (currentSongNumber === playlist.songs.length - 1) {
        setCurrentSongNumber(0);
        handlePlay();
      } else {
        const next_song_number = currentSongNumber + 1;
        const audio = new Audio(`music/${playlist.songs[next_song_number]}.mp3`);
        const album =  <img src={`images/${playlist.songs[next_song_number]}.jpg`} alt="album" />
        handleStop()
        setCurrentAlbum(album);
        setCurrentSong(audio);
        setCurrentSongNumber(next_song_number);
        audio.play();
        audio.addEventListener('ended', () => {
          setCurrentSong(null);
          setCurrentSongNumber(null);
          nextSong();
        });
      }
    } catch (error) {
      console.error("Oopsie error while changing to the next song:", error);
    }
  };
  
  const previousSong = () => {
    try {
      if (currentSongNumber === null) {
        handlePlay();
      } else if (currentSongNumber === 0) {
        setCurrentSongNumber(playlist.songs.length - 1);
        handlePlay();
      } else {
        const prev_song_number = currentSongNumber - 1;
        const audio = new Audio(`music/${playlist.songs[prev_song_number]}.mp3`);
        const album =  <img src={`images/${playlist.songs[prev_song_number]}.jpg`} alt="album" />
        handleStop()
        setCurrentAlbum(album);
        setCurrentSong(audio);
        setCurrentSongNumber(prev_song_number);
        audio.play();
        audio.addEventListener('ended', () => {
          setCurrentSong(null);
          setCurrentSongNumber(null);
          previousSong();
        });
      }
    } catch (error) {
      console.error("Oopsie error while changing to the previous song:", error);
    }
  };

  function customSong(number){
    try {
      if (currentSongNumber === null) {
        handlePlay();
      } else if (currentSongNumber === 0) {
        setCurrentSongNumber(number);
        handlePlay();
      } else {
        const audio = new Audio(`music/${playlist.songs[number]}.mp3`);
        const album =  <img src={`images/${playlist.songs[number]}.jpg`} alt="album" />
        handleStop()
        setCurrentAlbum(album);
        setCurrentSong(audio);
        setCurrentSongNumber(number);
        audio.play();
        audio.addEventListener('ended', () => {
          setCurrentSong(null);
          setCurrentSongNumber(null);
          previousSong();
        });
      }
    } catch (error) {
      console.error("Oopsie error while using the custom song function:", error);
    }
  };

  const handleStop = () => {
    try {
      if (currentSong) {
        currentSong.pause();
        setCurrentSong(null);
        setCurrentSongNumber(null);
        setCurrentTime(null);
        setDuration(null);
      }
    } catch (error) {
      console.error("Oopsie error while Stopping The current song:", error);
    }
  };

  const handlePause = () => {
    try {
      if (isPaused !== true) {
        currentSong.pause();
        setIsPaused(true);
      } else {
        currentSong.play();
        setIsPaused(false);
      }
    } catch (error) {
      console.error("Oopsie error with Pause:", error);
    }
  };   

  let percentage = duration ? Math.floor((currentTime / duration) * 100) : 0;

  const handleSliderChange = (value) => {
    const newTime = (value * duration) / 100;
    if (currentSong) {
      currentSong.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const restartSong = () => {
    currentSong.currentTime = 0;
    setCurrentTime(0);
  }

  return (
    <div>
    <div>
      Now Playing: <b>{(currentSong == null? "Nothing, press Play for a random song": currentSong && playlist && playlist.songs[currentSongNumber])}</b>
      <div className='BRUH'>
      {album}
      </div>
    </div>
    <ProgressBar className='ProgressBar' completed = {percentage} bgColor = "green" animateOnRender = {true} />
    <Slider
      min={0}
      max={100}
      value={percentage}
      onChange={handleSliderChange}
      style={{ width: 440, margin: 10, backgroundColor: '#333' }}
      railStyle={{ backgroundColor: '#ccc' }}
      trackStyle={{ backgroundColor: '#1db954' }}
      handleStyle={{ borderColor: '#1db954', borderWidth: 2 }}
    />
    <div className='controls'>
      <button onClick={previousSong}>{'<<<'}</button>
      <button onClick={handlePlay}>{(!currentSong ? 'Play': 'Stop')}</button>
      <button onClick={handlePause}>{(isPaused | !currentSong ? 'Resume' : 'Pause')}</button>
      <button onClick={nextSong}>{'>>>'}</button>
      <button onClick={restartSong}>{'Restart'}</button>
    </div>
    <div>
      <div className='playlist'>
        {playlist && playlist.songs && playlist.songs.map((song, index) => (
          <div key={index}>
            <button 
              key={index} 
              onClick={() => customSong(index)}
            >{song}</button>
          </div>
        ))}
      </div>
    </div>
    </div> 
  );

}

export default Player;