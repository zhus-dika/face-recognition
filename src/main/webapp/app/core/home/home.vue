<template>
    <div class="home row">
        <div class="col-md-7">
            <div class="booth">
                <video id="video" width="380" height="300" autoplay playsinline></video>
                <button @click="makePhoto" id="capture" class="booth-capture-button">Make a photo</button>
                <button @click="openVideo()" class="booth-capture-button">Open video</button>
                <canvas id="canvas" width="380" height="300"></canvas>
                <img src="http://goo.gl/qgUfzX" id="photo" alt="Your photo">
                <button @click="submitPhoto()" class="booth-capture-button">Send image</button>
            </div>
        </div>
        <div class="col-md-5">
            <h1 class="display-4">Welcome, Face Recognition System!</h1>
            <p class="lead">You can make a photo and check your authorization</p>

            <div>
                <div class="alert alert-success" v-if="authenticated">
                    <span v-if="username">You are logged in as user "{{username}}"</span>
                </div>

                <div class="alert alert-warning" v-if="!authenticated">
                    <span>If you want to </span>
                    <a class="alert-link" v-on:click="openLogin()">sign in</a><span >, you can try the default accounts:<br/>- Administrator (login="admin" and password="admin") <br/>- User (login="user" and password="user").</span>
                </div>
                <div class="alert alert-warning" v-if="!authenticated">
                    <span>You don't have an account yet?</span>&nbsp;
                    <router-link class="alert-link" to="/register">Register a new account</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./home.component.ts">
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
