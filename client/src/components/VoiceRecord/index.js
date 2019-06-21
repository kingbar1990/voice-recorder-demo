import axios from "axios";
import React from "react";
import ReactAudioPlayer from "react-audio-player";

import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { Button } from "@material-ui/core";
import {
  PlayCircleOutline,
  PauseCircleOutline,
  Mic,
  Stop,
  Redo,
  Clear
} from "@material-ui/icons";

import "./index.scss";

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.webkitGetUserMedia;

var timerId = 0;

class VoiceRecord extends React.Component {
  constructor(props) {
    super(props);
    this.chunks = [];

    this.state = {
      anchorIconEl: null,
      audioUrl: this.props.audio,
      recording: false,
      recorded: false,
      play: false,
      pause: true,
      duration: "00:00",
      timer: "00:00",
      currentTime: "00:00",
      counter: 3,
      audioId: null,
      snackbarOpen: false,
      soundList: []
    };
    this.audio = new Audio();
    this.audio.src = this.state.audioUrl;
    this.audio.currentTime = 55;
    this.audio.play();
    this.audio.pause();

    this.audio.addEventListener("timeupdate", this.updateTheTime, false);
    this.audio.addEventListener("durationchange", this.setTotal, false);
    this.audio.addEventListener("ended", this.pause, false);
  }

  componentDidMount() {
    this.refreshList();
  }

  componentWillMount() {
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      navigator.getUserMedia(constraints, this.onSuccess, this.onError);
    }
  }

  updateTheTime = () => {
    let sec = this.audio.currentTime;
    let min = Math.floor(sec / 60);
    sec = Math.floor(sec % 60);
    if (sec.toString().length < 2) sec = "0" + sec;
    if (min.toString().length < 2) min = "0" + min;
    this.setState({ currentTime: min + ":" + sec });
  };

  setTotal = () => {
    let sec = this.audio.duration;
    let min = Math.floor(sec / 60);
    sec = Math.floor(sec % 60);
    if (sec.toString().length < 2) sec = "0" + sec;
    if (min.toString().length < 2) min = "0" + min;
    this.setState({ duration: min + ":" + sec });
  };

  onStart = () => {
    let sec = 0,
      min = 0,
      counter = 3;
    this.setState({ recording: true, timer: "00:00" });
    let counterId = setInterval(() => {
      counter -= 1;
      this.setState({ counter: counter });
    }, 1000);

    setTimeout(() => {
      this.setState({ counter: 0 });
      clearInterval(counterId);
      try {
        this.mediaRecorder.start();
      } catch {
        alert(
          "Recording error. Make sure you grant an access to the mic in your browser"
        );
      }
      timerId = setInterval(() => {
        let seconds = 0,
          minutes = 0;

        sec += 1;
        if (sec === 60) {
          min += 1;
          sec = 0;
        }

        if (sec < 10) seconds = "0" + sec;
        else seconds = sec;
        if (min < 10) minutes = "0" + min;
        else minutes = min;

        this.setState({ timer: minutes + ":" + seconds });
      }, 1000);
    }, 3000);
  };

  onStop = () => {
    try {
      this.mediaRecorder.stop();
    } catch {
      alert(
        "Recording error. Make sure you grant an access to the mic in your browser"
      );
    }
    clearInterval(timerId);
    this.setState({ recording: false, recorded: true, snackbarOpen: true });
  };

  onError = err => {
    console.log("The following error occured: " + err);
  };

  onSuccess = stream => {
    this.mediaRecorder = new MediaRecorder(stream);
    if (!this.state.recording) {
      this.mediaRecorder.onstop = e => {
        if (this.state.recorded) {
          const blob = new Blob(this.chunks, {
            type: "audio/ogg; codecs=opus"
          });
          const audioUrl = window.URL.createObjectURL(blob);
          this.setState({ audioUrl: audioUrl });
          this.audio.src = audioUrl;
          this.chunks = [];

          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            axios
              .post("http://localhost:8000/audios/", { file: reader.result })
              .then(res => this.refreshList());
          };
        }
      };
    }

    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data);
    };
  };

  play = () => {
    this.audio.play();
    this.setState({ play: true, pause: false });
  };

  pause = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({ play: false, pause: true });
  };

  clear = () => {
    try {
      this.mediaRecorder.stop();
    } catch {
      alert(
        "Recording error. Make sure you grant an access to the mic in your browser"
      );
    }
    clearInterval(timerId);
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({
      recording: false,
      recorded: false,
      timer: "00:00",
      counter: 3
    });
  };

  redo = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({
      recording: false,
      timer: "00:00",
      audioUrl: "",
      counter: 3
    });
  };

  handleIconClick = event => {
    this.setState({
      anchorIconEl: event.currentTarget
    });
  };

  handleIconClose = () => {
    this.setState({ anchorIconEl: null });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  refreshList = () => {
    axios
      .get("http://localhost:8000/audios/")
      .then(res => this.setState({ soundList: res.data }))
      .catch(err => console.log(err));
  };

  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/audios/${item.id}`)
      .then(res => this.refreshList());
  };

  renderItems = () => {
    const newItems = this.state.soundList;
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item"
        style={{ listStyle: "none" }}
      >
        <div className="list-item">
          <div className="list-item-name">{item.name}</div>
          <ReactAudioPlayer src={`${item.audio}`} controls />
          <span>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={() => this.handleDelete(item)}
              className="delete-button"
            >
              Delete
            </Button>
          </span>
        </div>
      </li>
    ));
  };

  render() {
    return (
      <div className="content">
        <div className="audio">
          <Snackbar
            open={this.state.snackbarOpen}
            message="Audio recorded successfully!"
            autoHideDuration={1000}
            onClose={this.handleSnackbarClose}
          />
          <div>
            <div className="undo-button">
              {this.state.audioUrl ? (
                <IconButton className="icon-undo-button " onClick={this.redo}>
                  <Redo />
                </IconButton>
              ) : null}
              {this.state.recording & (this.state.counter === 0) ? (
                <IconButton className="icon-undo-button " onClick={this.clear}>
                  <Clear />
                </IconButton>
              ) : null}
            </div>
          </div>
          <div className="audio-content">
            <div className="rec-btn">
              {!this.state.audioUrl ? (
                <div>
                  {(this.state.counter === 3) & this.state.recording ? (
                    <Button className="icon-number-button">3</Button>
                  ) : null}
                  {(this.state.counter === 2) & this.state.recording ? (
                    <Button className="icon-number-button">2</Button>
                  ) : null}
                  {(this.state.counter === 1) & this.state.recording ? (
                    <Button className="icon-number-button">1</Button>
                  ) : null}
                  {!this.state.recording ? (
                    <Button
                      className="record-button-backgr-color"
                      onClick={this.onStart}
                    >
                      <Mic className="record-button" />
                    </Button>
                  ) : null}
                  {this.state.recording & (this.state.counter === 0) ? (
                    <Button
                      className="record-button-backgr-color"
                      onClick={this.onStop}
                    >
                      <Stop className="record-button" />
                    </Button>
                  ) : null}
                </div>
              ) : null}
              {this.state.audioUrl ? (
                <div className="play-stop-button">
                  {this.state.pause ? (
                    <Button onClick={this.play}>
                      <PlayCircleOutline />
                    </Button>
                  ) : null}
                  {this.state.play ? (
                    <Button onClick={this.pause}>
                      <PauseCircleOutline />
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className="timer">
            {this.state.audioUrl ? (
              <div>
                {this.state.play ? (
                  <label>{this.state.currentTime} </label>
                ) : null}
                {!this.state.play & (this.state.duration !== "Infinity:NaN") ? (
                  <label>{this.state.duration}</label>
                ) : null}
                {!this.state.play & (this.state.duration === "Infinity:NaN") ? (
                  <label>{this.state.timer}</label>
                ) : null}
              </div>
            ) : null}
            {this.state.recording ? (
              <label className="record-button-color">{this.state.timer}</label>
            ) : null}
          </div>
        </div>
        <div>
          <ul className="list-group list-group-flush">{this.renderItems()}</ul>
        </div>
      </div>
    );
  }
}

export default VoiceRecord;
