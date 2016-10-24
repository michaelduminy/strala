import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLoggedIn: boolean;

  constructor(public navCtrl: NavController) {
    this.isLoggedIn = false;
  }

  authWithStrava(): void {
    alert("clicked!");
  }

}
