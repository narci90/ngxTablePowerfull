import { Component, ViewEncapsulation } from '@angular/core';
import { NotificationNgxService } from '../ngxTablePowerfull/services/notificationNgx.service';
import { AppService } from './app.service';
import { sampleTableColumns } from './config/columns.config';
import { sampleTableMock } from './mock/sampleTable.mock'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'tablePowerfull';
  nameTable = 'Sample table';
  columns = sampleTableColumns;
  rows = sampleTableMock;

  config={
    headerBackground: '#EAE9E8',
    headerFontColor: 'black',
    borderTableColor: '#CDCECC',
    //columnMode: 'flex',
    minHeight: 400,
    headerHeight: 35,
    visibleBorderHeader: true,
    rowHeight: 35,
    //classTable: 'material',
    //footCounterSuffix: true,
    //onlyTable: true
  };

  constructor(private notificationNgxService : NotificationNgxService, private appService: AppService){}


  public captureEvent(e){
    if(e.name == 'delete'){
      this.rows.splice( this.rows.findIndex(r => r.id == e.row.id ) ,1);
      this.notificationNgxService.raise(this.nameTable, { rows: this.rows });
    }
  }

  public myFuncion(action): Promise<boolean>{
    return new Promise<boolean>(async (resolve) => {

        if(action.name === 'updateRow' && action.cell.column.prop == 'weight')
          resolve(this.checkedValue(action.cell));
    });
  }

  public checkedValue(values: any){
    console.log('You can only change it for a higher value');
    return values.newValue > values.oldValue ? true : false;
  }

  public async getOptionsName() : Promise<string[]>{
    return await this.appService.getNames();
  }

}
