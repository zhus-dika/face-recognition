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
                <div style="position: relative" class="margin">
                    <video onloadedmetadata="onPlay(this)" id="inputVideo" autoplay muted playsinline></video>
                    <canvas id="overlay" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
import axios from 'axios';
import * as faceapi from 'face-api.js';
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
        this.onPlay(this)
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

            if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
                return setTimeout(() => this.onPlay())


            const options = getFaceDetectorOptions()

            const ts = Date.now()

            const result = await faceapi.detectSingleFace(videoEl, options)

            updateTimeStats(Date.now() - ts)

            if (result) {
                const canvas = document.getElementById('#overlay');
                const dims = faceapi.matchDimensions(canvas, videoEl, true)
                faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims))
            }

            setTimeout(() => this.onPlay())
        },
        async run() {
            // load face detection model
            await changeFaceDetector(TINY_FACE_DETECTOR)
            changeInputSize(128)

            // try to access users webcam and stream the images
            // to the video element
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
            const videoEl = $('#inputVideo').get(0)
            videoEl.srcObject = stream
        },
        updateTimeStats(timeInMs) {
            this.forwardTimes = [timeInMs].concat(this.forwardTimes).slice(0, 30)
            const avgTimeInMs = this.forwardTimes.reduce((total, t) => total + t) / this.forwardTimes.length
            $('#time').val(`${Math.round(avgTimeInMs)} ms`)
            $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
        },
        updateResults() {}
    }
};
</script>
