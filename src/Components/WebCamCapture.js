import React, { Component } from 'react';
import Webcam from 'react-webcam';


export class WebCamCapture extends Component {

    displayName = WebCamCapture.name

    constructor(props) {
        super(props)
        this.state = { screenshot: null};

        setInterval(this.capture, 5000);
    }

    setRef = webcam => {
    this.webcam = webcam;
    };

    screenshot = null;

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();

        this.setState({ screenshot: imageSrc });
        var myContent = JSON.stringify(
            {
                cameraName: "fishcam",
                photo: imageSrc
            }
        );

    fetch('/api/Webcam/Capture',

        {

            method: 'POST',
            headers: { 'Content-Type': 'image/jpeg' },
            body: myContent

        })
        .then(response => console.log(response.json()));

    };

    render() {
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <div>
            <Webcam
            audio={false}
            height={350}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={350}
            videoConstraints={videoConstraints}
            />
            <button onClick={this.capture}> Capture Photo </button>
        </div>
    );
  }
}