import Component from 'vue-class-component';
import { Inject, Vue } from 'vue-property-decorator';
import LoginService from '@/account/login.service';
import axios from 'axios';

@Component
export default class Home extends Vue {
  @Inject('loginService')
  data() {
    return {
      video: document.getElementById('video'),
      canvas: document.getElementById('canvas'),
      context: document.getElementById('canvas').getContext('2d'),
      photo: document.getElementById('photo'),
      vendorUrl: window.URL || window.webkitURL,
    };
  }
  private loginService: () => LoginService;
  public openLogin(): void {
    this.loginService().openLogin((<any>this).$root);
  }

  public get authenticated(): boolean {
    return this.$store.getters.authenticated;
  }

  public get username(): string {
    return this.$store.getters.account ? this.$store.getters.account.login : '';
  }
  mounted() {
    this.initMethod();
  }
  public makePhoto() {
    const context = document.getElementById('canvas').getContext('2d');
    const video = document.getElementById('video');
    context.drawImage(video, 0, 0, 400, 300);
    const photo = document.getElementById('photo');
    const canvas = document.getElementById('canvas');
    photo.setAttribute('src', canvas.toDataURL('image/png'));
  }
  public initMethod(): void {
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getMedia(
      {
        video: true,
        audio: false,
      },
      function (stream) {
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.play();
      },
      function (error) {
        alert('Ошибка! Что-то пошло не так, попробуйте позже.');
      }
    );
  }
  public async submitPhoto() {
    const photo = document.getElementById('canvas').toDataURL('image/png');
    const data = new FormData();
    data.append('file', photo);
    axios.post(`/face/upload/file`, data).then(response => console.log(response.data));
  }
}
