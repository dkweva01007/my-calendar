import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { CalendarPage } from './../calendar/calendar';
import { CerclePage } from './../cercle/cercle';
import { Component, ViewChild, } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {
  //rootPage = HomePage;
  rootPage = LoginPage;
  // Reference to the app's root nav
  @ViewChild(Nav)nav: Nav;

  pages = [
    { title: 'Dashboard', component: HomePage, index: 0, icon: 'home' },
    //{ title: 'Calendrier', component: CalendarPage, index: 1, icon: 'calendar' },
    { title: 'Cercles', component: CerclePage, index: 2, icon: 'contacts' },
  ];

  constructor(public navCtrl: NavController, private auth: AuthProvider) { }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  isActive(page) {
    // Again the Tabs Navigation
    //let childNav = this.nav.getActiveChildNav();
    let childNav = this.nav.getActiveChildNavs()[0];
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

  logOut() {
    this.auth.logout()
      .then(() => {
        console.log('MenuPage | logged out');
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
      })
      .catch(err => console.error(err));
  }

}
