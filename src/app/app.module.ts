import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxTablePowerfullModule } from '../ngxTablePowerfull/ngxTablePowerfull.module'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    NgxTablePowerfullModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
