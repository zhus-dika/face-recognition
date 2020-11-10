<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h2>Current Camera</h2>
                <code v-if="device">{{ device.label }}</code>
                <div class="border">
                    <!--<vue-web-cam
                        ref="webcam"
                        :device-id="deviceId"
                        width="100%"
                        @started="onStarted"
                        @stopped="onStopped"
                        @error="onError"
                        @cameras="onCameras"
                        @camera-change="onCameraChange"
                    />-->
                    <div style="position: relative" class="margin">
                        <video onloadedmetadata="onPlay(this)" id="inputVideo" autoplay muted playsinline></video>
                        <canvas id="overlay" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <select v-model="camera">
                            <option>-- Select Device --</option>
                            <option
                                v-for="device in devices"
                                :key="device.deviceId"
                                :value="device.deviceId"
                            >{{ device.label }}</option>
                        </select>
                    </div>
                    <div class="col-md-12">
                        <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
                        <button type="button" class="btn btn-danger" @click="onStop">Stop Camera</button>
                        <button type="button" class="btn btn-success" @click="onStart">Start Camera</button>
                        <button type="button" class="btn btn-primary" @click="submitPhoto">Send Photo</button>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h2>Captured Image</h2>
                <figure class="figure">
                    <img :src="img" class="img-responsive" />
                </figure>
                <div class="row side-by-side">

                    <!-- face_detector_selection_control -->
                    <div id="face_detector_selection_control" class="row input-field" style="margin-right: 20px;">
                        <select id="selectFaceDetector">
                            <option value="ssd_mobilenetv1">SSD Mobilenet V1</option>
                            <option value="tiny_face_detector">Tiny Face Detector</option>
                        </select>
                        <label>Select Face Detector</label>
                    </div>
                    <!-- face_detector_selection_control -->

                    <!-- fps_meter -->
                    <div id="fps_meter" class="row side-by-side">
                        <div>
                            <label for="time">Time:</label>
                            <input disabled value="-" id="time" type="text" class="bold">
                            <label for="fps">Estimated Fps:</label>
                            <input disabled value="-" id="fps" type="text" class="bold">
                        </div>
                    </div>
                    <!-- fps_meter -->

                </div>


                <!-- ssd_mobilenetv1_controls -->
                <span id="ssd_mobilenetv1_controls">
      <div class="row side-by-side">
        <div class="row">
          <label for="minConfidence">Min Confidence:</label>
          <input disabled value="0.5" id="minConfidence" type="text" class="bold">
        </div>
        <button
            class="waves-effect waves-light btn"
            onclick="onDecreaseMinConfidence()"
        >
          <i class="material-icons left">-</i>
        </button>
        <button
            class="waves-effect waves-light btn"
            onclick="onIncreaseMinConfidence()"
        >
          <i class="material-icons left">+</i>
        </button>
      </div>
    </span>
                <!-- ssd_mobilenetv1_controls -->

                <!-- tiny_face_detector_controls -->
                <span id="tiny_face_detector_controls">
      <div class="row side-by-side">
        <div class="row input-field" style="margin-right: 20px;">
          <select id="inputSize">
            <option value="" disabled selected>Input Size:</option>
            <option value="128">128 x 128</option>
            <option value="160">160 x 160</option>
            <option value="224">224 x 224</option>
            <option value="320">320 x 320</option>
            <option value="416">416 x 416</option>
            <option value="512">512 x 512</option>
            <option value="608">608 x 608</option>
          </select>
          <label>Input Size</label>
        </div>
        <div class="row">
          <label for="scoreThreshold">Score Threshold:</label>
          <input disabled value="0.5" id="scoreThreshold" type="text" class="bold">
        </div>
        <button
            class="waves-effect waves-light btn"
            onclick="onDecreaseScoreThreshold()"
        >
          <i class="material-icons left">-</i>
        </button>
        <button
            class="waves-effect waves-light btn"
            onclick="onIncreaseScoreThreshold()"
        >
          <i class="material-icons left">+</i>
        </button>
      </div>
    </span>
            </div>
        </div>
    </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
import axios from 'axios';
import * as faceApi from 'face-api.js';
import * as external from '@/shared/external_js/faceDetectionControls';
export default {
    name: "App",
    components: {
        "vue-web-cam": WebCam
    },
    data() {
        return {
            img: null,
            camera: null,
            deviceId: null,
            devices: [],
            forwardTimes: []
        };
    },
    computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        }
    },
    mounted() {
        this.onPlay()
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
        },
        devices: function() {
            // Once we have a list select the first one
            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        }
    },
    methods: {
        onCapture() {
            this.img = this.$refs.webcam.capture();
        },
        onStarted(stream) {
            console.log("On Started Event", stream);
        },
        onStopped(stream) {
            console.log("On Stopped Event", stream);
        },
        onStop() {
            this.$refs.webcam.stop();
        },
        onStart() {
            this.$refs.webcam.start();
            this.onPlay(this)
        },
        onError(error) {
            console.log("On Error Event", error);
        },
        onCameras(cameras) {
            this.devices = cameras;
            console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        },
        async submitPhoto() {
            await axios.post(`/face/upload/file`,{ file: this.img }).then(response => console.log(response.data));
        },
        async onPlay() {
            const videoEl = document.getElementById('inputVideo');
            if(videoEl.paused || videoEl.ended || !external.isFaceDetectionModelLoaded())
                return setTimeout(() => this.onPlay())
            const options = external.getFaceDetectorOptions()
            const ts = Date.now()

            const result = await faceApi.detectSingleFace(videoEl, options)
            console.log(result);
            this.updateTimeStats(Date.now() - ts)

            if (result) {
                const canvas = document.getElementById('#overlay');
                const dims = faceapi.matchDimensions(canvas, videoEl, true)
                faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims))
            }

            setTimeout(() => this.onPlay())
        },
        async run() {
            // load face detection model
            await external.changeFaceDetector(TINY_FACE_DETECTOR)
            external.changeInputSize(128)

            // try to access users webcam and stream the images
            // to the video element
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
            const videoEl = document.getElementById('#inputVideo')
            videoEl.srcObject = stream
        },
        updateTimeStats(timeInMs) {
            this.forwardTimes = [timeInMs].concat(this.forwardTimes).slice(0, 30)
            const avgTimeInMs = this.forwardTimes.reduce((total, t) => total + t) / this.forwardTimes.length
            document.getElementById('time').val(`${Math.round(avgTimeInMs)} ms`)
            document.getElementById('fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
        },
        updateResults() {}
    }
};
</script>
