import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventModalCalendarDetailsPage } from './event-modal-calendar-details';

@NgModule({
  declarations: [
    EventModalCalendarDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventModalCalendarDetailsPage)
  ],
})
export class EventModalCalendarDetailsPageModule {}
