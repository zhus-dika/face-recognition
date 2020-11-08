import Component from 'vue-class-component';
import { Inject, Vue } from 'vue-property-decorator';
import LoginService from '@/account/login.service';
import axios from 'axios';
import { WebCam } from "vue-web-cam";


@Component({
  components: {
    "vue-web-cam": WebCam
  },
})
export default class Home extends Vue {
  @Inject('loginService')
  private loginService: () => LoginService;
  private img = null;
  private camera: any = null;
  private deviceId: number = null;
  private devices: Array<object> = [];
  /*@Watch('camera') cameraChanged(id: number) {
    this.deviceId = id;
  }*/
  public openLogin(): void {
    this.loginService().openLogin((<any>this).$root);
  }
mounted() {
this.camera = this.devices[0];
this.deviceId = this.camera.deviceId;
}
 get device() {
      return this.devices.find(n => n.deviceId === this.deviceId);
  }
  public get authenticated(): boolean {
    return this.$store.getters.authenticated;
  }

  public get username(): string {
    return this.$store.getters.account ? this.$store.getters.account.login : '';
  }
  public onStarted(stream) {
        console.log("On Started Event", stream);
  }
  public onStart() {
            this.$refs.webcam.start();
  }
public onCapture() {
            this.img = this.$refs.webcam.capture();
        }

        public onStopped(stream) {
            console.log("On Stopped Event", stream);
        }
        public onStop() {
            this.$refs.webcam.stop();
        }
        public onError(error) {
            console.log("On Error Event", error);
        }
        public onCameras(cameras) {
            this.devices = cameras;
            console.log("On Cameras Event", cameras);
        }
        public onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        }
}
