import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Strava } from '../../providers/strava'
import { Summary } from '../../models/summary'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profile: any
  name: string
  pic: string
  email: string
  summary: Summary

  constructor(public navCtrl: NavController, public storage: Storage, private stravaService: Strava) { };

  ionViewDidLoad() {
    console.log('Hello Home Page');

    this.storage.get('profile').then(x => {
      this.profile = JSON.parse(x)
      this.name = this.profile.firstname + this.profile.lastname;
      this.pic = this.profile.profile_medium;
      this.email = this.profile.email;
    }) 

    this.stravaService.processNewActivities()
      .then(() => this.storage.get('summary'))
      .then(x => this.summary = x)
  }
}