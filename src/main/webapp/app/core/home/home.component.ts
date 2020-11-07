import Component from 'vue-class-component';
import { Inject, Vue } from 'vue-property-decorator';
import LoginService from '@/account/login.service';
import axios from 'axios';
@Component({
  components: {},
})
export default class Home extends Vue {
  @Inject('loginService')
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
    //this.initMethod();
  }
  public makePhoto() {
    const context = document.getElementById('canvas').getContext('2d');
    const video = document.getElementById('video');
    context.drawImage(video, 0, 0, 400, 300);
    const photo = document.getElementById('photo');
    const canvas = document.getElementById('canvas');
    photo.setAttribute('src', canvas.toDataURL('image/jpg'));
  }
  public handleSuccess(stream) {
    const constraints = { audio: false, video: { width: 1280, height: 720 } };
    const video = document.querySelector('video');
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
  }

  public handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const constraints = { audio: false, video: { width: 380, height: 300 } };
      const v = constraints.video;
      alert(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      alert(
        'Permissions have not been granted to use your camera and ' +
          'microphone, you need to allow the page access to your devices in ' +
          'order for the demo to work.'
      );
    }
    console.log(error);
    alert(`getUserMedia error: ${error.name}`, error);
  }

  public errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  public async openVideo(e) {
    try {
      const constraints = { audio: false, video: { width: 380, height: 300 } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.handleSuccess(stream);
      e.target.disabled = true;
    } catch (e) {
      this.handleError(e);
    }
  }
  public async submitPhoto() {
    const photo = document.getElementById('canvas').toDataURL('image/jpg');
    if (photo) await axios.post(`/face/upload/file`, { file: photo }).then(response => console.log(response.data));
  }
}
