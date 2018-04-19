import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpModule} from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { CalendarPage } from '../pages/calendar/calendar';
import { CerclePage } from '../pages/cercle/cercle';


import { NgCalendarModule  } from 'ionic2-calendar';
import { GHttpProvider } from '../providers/g-http/g-http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
	MenuPage,
	CalendarPage,
	CerclePage
  ],
  imports: [
	NgCalendarModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
	MenuPage,
	CalendarPage,
	CerclePage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GHttpProvider
  ]
})
export class AppModule {}
