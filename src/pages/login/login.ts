import { Component } from '@angular/core'
import { NavController, LoadingController } from 'ionic-angular'
import { Strava } from '../../providers/strava'
import { Storage } from '@ionic/storage'
import { HomePage } from '../home/home'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  isLoggedIn: boolean;
  name: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private storage: Storage, private stravaService: Strava) { }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  authWithStrava(): void {

    let loader = this.loadingCtrl.create({
      content: "Reticulating splines...",
      dismissOnPageChange: true
    });

    this.stravaService.startAuthFlow(loader)
      .then(x => this.processLoggedIn(x))
      .then(() => this.navCtrl.setRoot(HomePage))
      .catch(x => console.log(JSON.stringify(x)))
  }

  processLoggedIn(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.setItem('loggedIn', 'true')
      this.storage.set('access_token', obj.access_token)
      this.storage.set('profile', JSON.stringify(obj.athlete)).then(resolve)
    })
  }
}
