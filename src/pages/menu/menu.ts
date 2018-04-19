import { HomePage } from './../home/home';
import { CalendarPage } from './../calendar/calendar';
import { CerclePage } from './../cercle/cercle';
import { Component, ViewChild, } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {
  rootPage = HomePage;
  // Reference to the app's root nav
  @ViewChild(Nav)nav: Nav;
 
  pages = [
    { title: 'Profile', component: HomePage, index: 0, icon: 'home' },
    { title: 'Calendrier', component: CalendarPage, index: 1, icon: 'contacts' },
    { title: 'Cercle d\'ami', component: CerclePage, index: 2, icon: 'contacts' },
  ];

  constructor(public navCtrl: NavController) { }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  isActive(page) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }
    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }
}