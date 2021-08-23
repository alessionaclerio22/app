import React, { Component } from "react";
import API from "../api/API_prova";

class JitsiComponent extends Component {
  domain = "meet.jit.si";
  api = {};

  constructor(props) {
    super(props);
    this.state = {
      isAudioMuted: false,
      isVideoMuted: false,
    };
  }

  startMeet = () => {
    if (this.props.tipo === "paziente") {
      API.getPazienteById(this.props.id)
        .then((p) => {
          const options = {
            roomName: "room-" + this.props.id,
            width: "100%",
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
              // overwrite interface properties
            },
            parentNode: document.querySelector("#jitsi-iframe"),
            userInfo: {
              displayName: p.nome,
            },
          };
          this.api = new window.JitsiMeetExternalAPI(this.domain, options);

          this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus,
          });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "medico") {
      API.getMedicoById(this.props.id)
        .then((m) => {
          const options = {
            roomName: "room-" + this.props.pid,
            width: "100%",
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
              // overwrite interface properties
            },
            parentNode: document.querySelector("#jitsi-iframe"),
            userInfo: {
              displayName: m.nome,
            },
          };
          this.api = new window.JitsiMeetExternalAPI(this.domain, options);

          this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus,
          });
        })
        .catch((errorObj) => console.error(errorObj));
    } else if (this.props.tipo === "infermiere") {
      API.getInfermiereById(this.props.id)
        .then((m) => {
          const options = {
            roomName: "room-" + this.props.pid,
            width: "100%",
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
              // overwrite interface properties
            },
            parentNode: document.querySelector("#jitsi-iframe"),
            userInfo: {
              displayName: m.nome,
            },
          };
          this.api = new window.JitsiMeetExternalAPI(this.domain, options);

          this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus,
          });
        })
        .catch((errorObj) => console.error(errorObj));
    }
  };

  handleClose = () => {
    console.log("handleClose");
  };

  handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  };

  handleParticipantJoined = async (participant) => {
    console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  };

  handleVideoConferenceJoined = async (participant) => {
    console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  };

  handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    return this.props.history.push("/");
  };

  handleMuteStatus = (audio) => {
    console.log("handleMuteStatus", audio); // { muted: true }
  };

  handleVideoStatus = (video) => {
    console.log("handleVideoStatus", video); // { muted: true }
  };

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }

  // custom events
  executeCommand(command) {
    this.api.executeCommand(command);
    if (command == "hangup") {
      return this.props.history.push("/thank-you");
    }

    if (command == "toggleAudio") {
      this.setState({ isAudioMuted: !this.state.isAudioMuted });
    }

    if (command == "toggleVideo") {
      this.setState({ isVideoMuted: !this.state.isVideoMuted });
    }
  }

  componentDidMount() {
    if (window.JitsiMeetExternalAPI) {
      this.startMeet();
    } else {
      alert("JitsiMeetExternalAPI not loaded");
    }
  }

  render() {
    const { isAudioMuted, isVideoMuted } = this.state;
    return (
      <>
        <header className="nav-bar">
          <p className="item-left heading">Jitsi React</p>
        </header>
        <div id="jitsi-iframe" style={{height: "100vh"}}></div>
        <div class="item-center">
          <span>Custom Controls</span>
        </div>
        <div class="item-center">
          <span>&nbsp;&nbsp;</span>
          <i
            onClick={() => this.executeCommand("toggleAudio")}
            className={`fas fa-2x grey-color ${
              isAudioMuted ? "fa-microphone-slash" : "fa-microphone"
            }`}
            aria-hidden="true"
            title="Mute / Unmute"
          ></i>
          <i
            onClick={() => this.executeCommand("hangup")}
            className="fas fa-phone-slash fa-2x red-color"
            aria-hidden="true"
            title="Leave"
          ></i>
          <i
            onClick={() => this.executeCommand("toggleVideo")}
            className={`fas fa-2x grey-color ${
              isVideoMuted ? "fa-video-slash" : "fa-video"
            }`}
            aria-hidden="true"
            title="Start / Stop camera"
          ></i>
          <i
            onClick={() => this.executeCommand("toggleShareScreen")}
            className="fas fa-film fa-2x grey-color"
            aria-hidden="true"
            title="Share your screen"
          ></i>
        </div>
      </>
    );
  }
}

export default JitsiComponent;
