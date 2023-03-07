
// face-api.js is an open-source JavaScript library that provides face detection, recognition, and analysis
//  capabilities using pre-trained artificial intelligence models. The library is built on top of TensorFlow.js, 
//  which is a JavaScript library for training and deploying machine learning models in the browser or on Node.js.


// The models used by face-api include:

// Face detection: The face detection model used by face-api is based on Single Shot Detector (SSD) based on a MobileNet architecture,
// which is optimized for low memory devices such as mobile phones and web browsers. This is a deep learning model for object detection.
// The pre-trained model is able to detect faces in images and video streams.

// Face recognition: The face recognition model used by face-api is based on a deep convolutional neural 
// network (CNN) architecture called FaceNet. This model is able to generate a numerical embedding for each face that can be
//  used for face matching and identification.

// Face landmark detection: The face landmark detection model used by face-api is based on the ResNet-50 architecture, 
// which is a deep CNN model. This model is able to detect and locate facial landmarks such as the eyes, nose, and mouth.

const video = document.getElementById("video");
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    const resizedDetections = faceapi.resizeResults(detections, {
      height: video.height,
      width: video.width,
    });
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    console.log(detections);
  }, 100);
});
