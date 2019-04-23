import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {


  private tempUnits: boolean = true; // true=metric, false=imperial
  private windUnits: boolean = true; // true=metric, false=imperial

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    
    this.storage.get('tempUnits').then((val) => {
      this.tempUnits = val;
    })

    this.storage.get('windUnits').then((val) => {
      this.windUnits = val;
    })
  }

  toggleTempUnits() {
    this.storage.set('tempUnits', this.tempUnits);
  }

  toggleWindUnits() {
    this.storage.set('windUnits', this.windUnits);
  }

}