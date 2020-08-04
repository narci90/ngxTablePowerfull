import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxTableComponent } from './ngxTable.component'; 
import { NgxTableDialogComponent } from './components/ngxTableDialog/ngxTableDialog.component';
import { EditColumnDialogComponent } from './components/editColumnDialog/editColumnDialog.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxTableService } from './services/ngxTable.service';
import { NotificationNgxService } from './services/notificationNgx.service';
import { MaterialModule } from './modules/material.module';
import { GridColumnsComponent } from './components/gridColumns/gridColumns.component';

@NgModule({
  declarations: [
    NgxTableComponent,
    NgxTableDialogComponent,
    EditColumnDialogComponent,
    GridColumnsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  entryComponents:[
    NgxTableDialogComponent,
    EditColumnDialogComponent,
    GridColumnsComponent
  ],
  providers: [
    NgxTableService,
    NotificationNgxService
  ],
  exports: [
    NgxTableComponent,
    NgxTableDialogComponent,
    EditColumnDialogComponent,
    GridColumnsComponent
  ]
})

export class NgxTablePowerfullModule { 
  
}
