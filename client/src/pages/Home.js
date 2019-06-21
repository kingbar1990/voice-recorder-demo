import React from "react";

import VoiceRecord from "../components/VoiceRecord/index";
import Navbar from "../components/NavBar/index";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <VoiceRecord audio={""} />
      </div>
    );
  }
}

export default Home;
