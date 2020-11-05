<template>
    <div class="booth">
        <video id="video" width="380" height="300" autoplay></video>
        <a href="#" id="capture" class="booth-capture-button">Make a photo</a>
        <canvas id="canvas" width="380" height="300"></canvas>
        <img src="http://goo.gl/qgUfzX" id="photo" alt="Your photo">
        <button @click="submitPhoto()" class="booth-capture-button">Send image</button>
    </div>
</template>
<script>
export default {
        mounted() {
            this.initMethod()
        },
        methods: {
            initMethod() {
                const video = document.getElementById('video');
                const canvas = document.getElementById('canvas');
                const context = canvas.getContext('2d');
                const photo = document.getElementById('photo');
                const vendorUrl = window.URL || window.webkitURL;
                navigator
                    .getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                navigator
                    .getMedia({
                        video: true,
                        audio: false
                    }, function(stream) {
                        video.srcObject = stream;
                        video.play();
                    }, function(error) {
                        alert('Ошибка! Что-то пошло не так, попробуйте позже.');
                    });
                document
                    .getElementById('capture').addEventListener('click', function() {
                    context.drawImage(video, 0, 0, 400, 300);
                    photo.setAttribute('src', canvas.toDataURL('image/png'));
                });
            },
            prepareToSubmit(callback) {
                const photo = document.getElementById('canvas').toDataURL('image/png');
                const data = new FormData();
                data.append('file', photo);
                callback(data);
            },
            submitPhoto() {
                console.log('from submit');
                this.prepareToSubmit(this.sendFile);
            },
            sendFile(formData) {
                axios.post(`/face/upload/file`, formData)
                    .then(response => console.log(response.data));
            }
        }
}
</script>
<style lang="scss">
.booth {
    width: 400px;
    background: #ccc;
    border: 10px solid #ddd;
    margin: 0 auto;
}

.booth-capture-button {
    display: block;
    margin: 10px 0;
    padding: 10px 20px;
    background: cornflowerblue;
    color: #fff;
    text-align: center;
    text-decoration: none;
}

#canvas {
    display: none;
}
.btn-submit {
    margin: auto;
}
</style>
