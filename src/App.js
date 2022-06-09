import React from "react";
// import {  } from "react-icons";

export default function App() {
  let [file, setFile] = React.useState(null);
  let [modal, setModal] = React.useState(null);
  let [volume, setVolume] = React.useState(1);
  let [title, setTitle] = React.useState('Video Loader');

  let [currentTime, setCurrentTime] = React.useState(0);

  const handleChange = e => {
    /** @type {File} */
    let file = e.target?.files[0];
    if (file === undefined || file == null || !file.name.match(/.mp4$|.mkv$|.mov$/)) {
      let _ = file.name.split('.');
      let ext = _[_.length - 1];
      setModal(`Could not read ${_.length > 1 ? "." : ""}${ext} files.`);
      return;
    }
    setFile(URL.createObjectURL(e.target?.files[0]));
    setTitle(file.name.replace("_", " "));
  }
  const autoBlur = e => {
    e.target.blur();
  }

  const ref = React.useRef(null);
  const fc = React.useRef(null);

  const videoShortcuts = (action = "") => {
    if (!ref.current) return;
    let {current: video} = ref;
    const steps = {
      small: 5,
      big: 10
    };

    switch(action) {
      case "vol_down":
        video.volume = video.volume < .05 ? 0 : video.volume - .05;
        break;
      case "vol_up":
        video.volume = video.volume === 1 ? 1 : video.volume + .05;
        break;
      case "back_5":
        video.currentTime = video.currentTime < steps.big ? 0 : video.currentTime - steps.big;
        break;
      case "forw_5":
        video.currentTime = video.currentTime > video.duration + steps.small ? video.duration : video.currentTime + steps.small;
        break;
      case "back_10":
        video.currentTime = video.currentTime < steps.big ? 0 : video.currentTime - steps.big;
        break;
      case "forw_10":
        video.currentTime = video.currentTime > video.duration + steps.big ? video.duration : video.currentTime + steps.big
        break;
      case "toggle_pause":
        if (video.paused) video.play();
        else video.pause();
        break;
      case "toggle_mute":
        video.muted = !video.muted;
        break;
      case "toggle_fc":
        if (window.innerHeight === window.screen.height && window.innerWidth === window.screen.width) document.exitFullscreen();
        else fc.current?.requestFullscreen();
        break;
      default:
        break;
    }
    setVolume(_ => video.volume);
    setCurrentTime(_ => video.currentTime / video.duration);
  }

  // console.log(currentTime);
  React.useEffect(() => {
    if (!ref.current || file == null) return;

    const handleKey = e => {
      let {code} = e;
      switch(code) {
        // Play backwards and forwards
        case "KeyA":
        case "ArrowLeft": { videoShortcuts("back_5"); break; }
        case "KeyD":
        case "ArrowRight": { videoShortcuts("forw_5"); break; }
        case "KeyJ": { videoShortcuts("back_10"); break; }
        case "KeyL": { videoShortcuts("forw_10"); break; }
        // Control volume
        case "KeyM": { videoShortcuts("toggle_mute"); break; }
        case "KeyW": { videoShortcuts("vol_up"); break; }
        case "KeyS": { videoShortcuts("vol_down"); break; }
        // Toggle paused / unpaused
        case "Space":
        case "KeyK": { videoShortcuts("toggle_pause"); break; }
        default: break;
      }
    }

    window.addEventListener("keypress", handleKey);
    return () => window.removeEventListener("keypress", handleKey);
  }, [file, ref]);

  return <React.Fragment>
    {modal && <div className="modal">
      <div className="container">
        <span>{modal}</span>
        <button onClick={() => setModal(null)}>Okay</button>
      </div>
    </div>}
    <div className="container">
      {!file && <div className="upload">
        <label className="upload-file">
          <input type="file" accept="video/*" hidden onChange={handleChange} />
          Upload File
        </label>
      </div>}
      {file && <div className="video-player" ref={fc}>
        <video src={file} ref={ref} onTimeUpdate={e => setCurrentTime(e.target.currentTime / e.target.duration)}></video>
        <div className="controls">
          <span className="title">{title}</span>
          <input type="range" value={currentTime} min={0} max={1} step={.001} className="time-input" onChange={e => {if (ref.current) ref.current.currentTime = ref.current.duration * e.target.value; setCurrentTime(_ => ref.current.currentTime / ref.current.duration)}} onFocus={autoBlur} />
          <input type="range" value={volume} min={0} max={1} step={.05} className="vol-input" onChange={e => {if (ref.current) ref.current.volume = e.target.value; setVolume(_ => ref.current.volume);}} onFocus={autoBlur} />
          <button className="pause" onClick={() => videoShortcuts("toggle_pause")} onFocus={autoBlur}>{ref.current?.paused ? "Play" : "Pause"}</button>
          <button className="mute" onClick={() => videoShortcuts("toggle_mute")} onFocus={autoBlur}>{(ref.current?.muted || ref.current?.volume === 0) ? "Unmute": "Mute"}</button>
          <button className="fc" onClick={() => videoShortcuts("toggle_fc")} onFocus={autoBlur}>FC</button>
        </div>
      </div>}
    </div>
  </React.Fragment>
}