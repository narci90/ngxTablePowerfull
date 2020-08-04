import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActionColumnType } from '../../common/actionsColumn.type';
import { FunctionTypes } from '../../models/sumaryColumn.model';
import { ColumnTableModel } from '../../models/columnTable.model';

@Component({
  selector: 'edit-column-dialog-component',
  templateUrl: './editColumnDialog.component.html',
  styleUrls: ['./editColumnDialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditColumnDialogComponent {
    public title: string;
    public nameColumn: string = '';
    public predefinedText: string = '-';
    public numberColumns:  any[] = [];
    public positionColumn: number;
    public columns: Object[];
    public column: number = 1;
    public functions: any[] = FunctionTypes;
    public applyFunctions: boolean[] = new Array(FunctionTypes.length);
    public unitsFunctions: string[] = new Array(FunctionTypes.length);
    public editable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){

      switch(this.data.action){

        case ActionColumnType.ADD:
          this.numberColumns = new Array(this.data.nColumns);
          this.positionColumn = this.data.nColumns;
          this.title = this.data.config.language.newColumn;
          this.editable = true;
          break;

        case ActionColumnType.EDIT:
          this.columns = this.data.columns;
          this.nameColumn = this.columns[0]['name'];
          this.numberColumns = new Array(this.columns.length);
          this.positionColumn = 1;
          this.title = this.data.config.language.editColumn;
          this.checkFunctionColumn();
          this.editable = this.isEditable();
          break;
          
          
        case ActionColumnType.DELETE:
          this.columns = this.data.columns;
          this.title = this.data.config.language.deleteColumn;
          break;
          
        default:
          this.close();

      }

    }

    public changeColumn(){

      if(this.data.action === ActionColumnType.EDIT) { 
        this.nameColumn = this.columns[this.column - 1]['name'];
        this.positionColumn = this.column;
      }

      this.applyFunctions = new Array(FunctionTypes.length);
      this.unitsFunctions = new Array(FunctionTypes.length);
      this.checkFunctionColumn();
      this.editable = this.isEditable();
    }

    public onSubmit(){

      switch(this.data.action){

        case ActionColumnType.ADD:
          this.dialogRef.close({ name:this.nameColumn.trim(), predefined: this.predefinedText, position: this.positionColumn, functions: this.applyFunctions, unitsFuntions: this.unitsFunctions, editable: this.editable });
          break;

        case ActionColumnType.EDIT:
          this.dialogRef.close({ name:this.nameColumn.trim(), column: this.column, newPosition: this.positionColumn, functions: this.applyFunctions, unitsFuntions: this.unitsFunctions, editable: this.editable}); 
          break;
          
        case ActionColumnType.DELETE:
          this.dialogRef.close({ column: this.column}); 
          break;
          
        default:
          this.close();

      }
    }

    public isEditable(): boolean{
      return new ColumnTableModel(this.columns[this.column - 1]).editable;
    }

    public checkFunctionColumn(){

      const sumary = new ColumnTableModel(this.columns[this.column - 1]).sumary;
      if(!!sumary.length){
        sumary.forEach( s => {
          if(s.type != null){
            this.functions.forEach((f) => {
              if(f.type === s.type){
                  this.applyFunctions[s.type] = true;
                  this.unitsFunctions[s.type] = s.unit;
              }
            });
          }
        });
      } else {
        this.applyFunctions = new Array(FunctionTypes.length);
        this.unitsFunctions = new Array(FunctionTypes.length);
      }
    }

    public close(){
      this.dialogRef.close();
    }

}