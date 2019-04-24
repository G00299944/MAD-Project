import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {


  private tempUnits: boolean; // true=metric, false=imperial
  private windUnits: boolean = true; // true=metric, false=imperial

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  // Methods ====================================================================================================
  // ion load methods ==================================================
  ionViewDidLoad() { 
    this.storage.get('tempUnits').then((val) => { // load temperature units from storage || default to metric
      if(val!=null) {
        this.tempUnits = val;
      }
      else {
        this.tempUnits = true;
      }
    })

    this.storage.get('windUnits').then((val) => { // load wind speed units from storage || default to metric
      if(val!=null) {
        this.windUnits = val;
      }
      else {
        this.windUnits = true;
      }
    })
  }

  toggleTempUnits() { // when view component is toggled, toggle boolean value
    this.storage.set('tempUnits', this.tempUnits); // save setting to local storage
  }

  toggleWindUnits() { // when view component is toggled, toggle boolean value
    this.storage.set('windUnits', this.windUnits); // save setting to local storage
  }

}
