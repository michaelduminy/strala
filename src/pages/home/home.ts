import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Strava } from '../../providers/strava'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profile: any
  name: string
  pic: string

  constructor(public navCtrl: NavController, public storage: Storage, private stravaService: Strava) { };

  ionViewDidLoad() {
    console.log('Hello Home Page');

    this.storage.get('profile').then(x => {
      this.profile = JSON.parse(x)
      this.name = this.profile.firstname + this.profile.lastname;
      this.pic = this.profile.profile_medium;
    }) 

    this.stravaService.processNewActivities()
  }
}