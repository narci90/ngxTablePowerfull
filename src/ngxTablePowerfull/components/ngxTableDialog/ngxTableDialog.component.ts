import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ColumnTableModel, TagTypes } from '../../models/columnTable.model';
import { AttributesModel, AttributesTypes } from '../../models/attributes.model';
import { NotificationNgxService } from '../../services/notificationNgx.service';
import { ConfigTableModel } from '../../models/configTable.model';

@Component({
  selector: 'ngx-table-dialog-component',
  templateUrl: './ngxTableDialog.component.html',
  styleUrls: ['./ngxTableDialog.component.scss']
})
export class NgxTableDialogComponent {
  public rows;
  public columns;
  public indexNewColumn: number = 0;
  public tableConfig = new ConfigTableModel({
    primaryColor: this.data.config.primaryColor,
    secondaryColor: this.data.config.secondaryColor,
    hoverRowColor: this.data.config.hoverRowColor,
    headerBackground: this.data.config.headerBackground,
    headerFontColor: this.data.config.headerFontColor,
    headerHeight: this.data.config.headerHeight,
    visibleBorderHeader: this.data.config.visibleBorderHeader,
    borderTableColor: this.data.config.borderTableColor,
    rowHeight: this.data.config.rowHeight,
    footerHeight: this.data.config.footerHeight,
    multipleSelection: false,
    classTable: this.data.config.classTable,
    language: this.data.config.language,
    columnMode: this.data.config.columnMode
  });

  constructor(
    public dialogRef: MatDialogRef<NgxTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notification: NotificationNgxService
    ){}

    ngOnInit(){
      
      const columnClose = {
        prop: 'delete',
        name: '',
        action: 'delete',
        predefinedData: 'delete',
        tooltip: true,
        tooltipText: this.data.config.language.deleteRow,
        tag: TagTypes.ICON,
        attributes: [ 
          new AttributesModel(
            {
              name: AttributesTypes.CLASS,
              value: 'material-icons delete-icon'
            }
          )
        ]
      };
      
      this.rows = JSON.parse(JSON.stringify(this.data.rows));

      this.columns = (this.data.columns.filter(c => !c.action)).map( c => new ColumnTableModel(c));
      this.columns.push(new ColumnTableModel(columnClose));

    }

    
    ngAfterViewInit(){
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    }

    public eventRow(e){

      if(e.name === 'delete'){

        const index = this.columns.find(c => !!c.index).prop;

        this.rows.forEach((r, i) => {
          if(r[index] === e.row[index]) {
            this.rows.splice(i, 1);
            this.notification.raise(this.data.name, { rows: this.rows });
            return;
          }
        })

      }

    }

    public close(){
      this.dialogRef.close();
    }

}