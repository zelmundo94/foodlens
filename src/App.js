import React, { Component } from "react";
import Camera, { IMAGE_TYPES, FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Loader from "react-loader-spinner";
import "./App.css";
import "./Camera.css";
import "./Emojicon";
import Modal from "./Modal";
import AnotherRecipeButton from "./Components/Recipes";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idealFacingMode: FACING_MODES.USER, 
      myArray: [],
      fishclass: "",
      loading: false,
      cameraOn: true,
      image: false,
      key: "",
      upload: false,
      dataUri: "",
      prediction: false,
      isOpen: false,
      isEmptyState: true,
      recipes: [ {id: 'pompano', title: 'fried pompano'} ],
      displayRecipes: false
    };
  }

 

    
  

  triggerRecipeState = () => {
    this.setState({
        displayRecipes: !this.state.displayRecipes
    })
}



  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }

  showCamera = e => {
    this.setState({
      cameraOn: true,
      image: false,
      loading: false,
      fishclass: "",
      confidence: "",
      dataUri: "",
      key: ""
    });
  };

  onTakePhoto(dataUri) {
    const savedImage = dataUri.split(",")[1];
    fetch(
      /* API endpoint here */ "https://50xlesnkqe.execute-api.us-east-1.amazonaws.com/foodLens-deploy1/index",
      {
        method: "POST",
        body: JSON.stringify({ payload: savedImage })
      }
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          savedImage: data,
          cameraOn: false,
          loading: true,
          dataUri: savedImage
        })
      )
      .catch(err => console.log(err));
  }

  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
    console.log("clicked");
  };


  handleUpload = event => {
    if (this.uploadInput.files[0]) {
      let file = this.uploadInput.files[0];
      this.getBase64(file, result => {
        fetch(
          /* S3 endpoint here */ "https://50xlesnkqe.execute-api.us-east-1.amazonaws.com/foodLens-deploy1/index",
          {
            method: "POST",
            headers: {
              //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
              //'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify({ payload: result.split(",")[1] })
          }
        )
          .then(response => response.json())
          .then(data => {
        
            console.log("tmp: ", data);
          

            this.setState({
              result: data,
              cameraOn: false,
              image: true,
              dataUri: result,
              loading: true,
              isOpen: true,
              message: "UPLOAD AN IMAGE"
            });
          })
          .catch(err => console.log(err));
      });
    } else {
      return null;
    }
  };



  handleChange = e => {
    if (this.uploadInput.files[0]) {
      let file = this.uploadInput.files[0];
      this.getBase64(file, result => {
        this.setState({
          dataUri: result,
          cameraOn: false,
          image: true,
          prediction: false
        });
      });
    }
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  changeCameraType() {
    if (this.state.idealFacingMode === FACING_MODES.ENVIRONMENT) {
      this.setState({
        idealFacingMode: FACING_MODES.USER,
        isImageMirror: true
      });
    } else {
      this.setState({
        idealFacingMode: FACING_MODES.ENVIRONMENT,
        isImageMirror: false
      });
    }
  }

  // displayResults = () => {
  //   let popArray = [];
  //   for (let key in this.state.result) {
  //     popArray.push(
  //       <p key={key} className="information">
  //         {key}: {this.state.result[key]}
  //       </p>
  //     );
  //   }
  //   return popArray;
  // };

  displayResults = () => {
    let popArray = [];
    popArray.push(
      <ol className="information">
       <li>Name: {this.state.result.name}</li>
       <li>Size: {this.state.result.size}</li>
       <li>Habitat: {this.state.result.habitat} </li>
       <li>Weight: {this.state.result.weight}</li>
       <li>Ethnicity: {this.state.result.ethnicity}</li>
      </ol>
    );
    return popArray;
  };

 
  render() {

    let recipes = null;

    if ( this.state.displayRecipes ) {
      recipes = (
      <div>
           { this.state.recipes.map((recipe, index) => {
                return <AnotherRecipeButton key={recipe.id}
                title={recipe.title} />
           }) }
      </div>
      
      ) 
    }

   

    return (
      <div className="bg-image">
      <div className="App">
      
          <div className="wizard">
            <h1>FOODLENS 🧐</h1>
            {/*  {this.state.loading
              ? setTimeout(() => {
                  this.predictFish(  invoke endpoint URL
                    "",
                    {
                      //method: "POST",
                      headers: {
                        //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        //'Access-Control-Allow-Origin': "*"
                      },
                       body: JSON.stringify({
                        url:
                         "" +
                          this.state.key
                      })
                    }
                  );
                }, 2500)
              : null} */}
            {this.state.loading ? (
              <Loader type="Grid" color="#008080" height="80" width="80" />
            ) : null}
            {this.state.image ? (
              <div className="prediction">
                <img
                  className="fishImg"
                  src={this.state.dataUri}
                  alt="uploaded pic of fish"
                  onClick={this.handleShowDialog}
                />
                {this.state.prediction ? (
                  <div>
                    {parseFloat(this.state.confidence) > 85 ? (
                      <div className="prediction">
                        <p>
                          {/* This is a <span>{this.state.result}</span>  */}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p>
                          We were unable to identify this fish. Please try
                          again.
                        </p>
                      </div>
                    )}
                    <button className="openCamera" onClick={this.showCamera}>
                      Wanna take more photos?
                    </button>
                  </div>
                ) : null}
                <div>
                  {/* This is a {" "} */}
                  <Modal show={this.state.isOpen} onClose={this.toggleModal}>
                    {this.state.result !== undefined
                      ? this.displayResults()
                      : ""}
                  </Modal>
                  <span>{this.state.payload}</span>
                </div>
                <button className="openCamera" onClick={this.showCamera}>
                  Take another photo!
                </button>

                <button className="recipeButton" onClick={this.triggerRecipeState}>View Recipes</button>
               {recipes}

              </div>
            ) : null}
            {this.state.cameraOn ? (
              <div className="camera">
                <Camera
                  imageType={IMAGE_TYPES.JPG}
                  idealFacingMode={this.state.idealFacingMode} 
                  isImageMirror={this.state.isImageMirror}
                  idealResolution={{ width: 640, height: 1440 }}
                  onTakePhoto={dataUri => {
                    this.onTakePhoto(dataUri);
                  }}
                />
                <button onClick={this.changeCameraType.bind(this)}>
            SWITCH</button>
              </div>
            ) : null}
            {this.state.loading ? null : (
              <div className="uploader">
                <input
                  className="inputfile"
                  id="inputfile"
                  name="input"
                  ref={ref => {
                    this.uploadInput = ref;
                  }}
                  onChange={this.handleChange}
                  type="file"
                  accept="image/jpeg"
                />
                <label htmlFor="inputfile">
                  SELECT <span role="img" />
                </label>
                <button className="uploadButton" onClick={this.handleUpload}>
                  DETECT
                </button>
              </div>
            )}
          </div>
        
      </div>
      </div>
    );
  }
}
export default App;