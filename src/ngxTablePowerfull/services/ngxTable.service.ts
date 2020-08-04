import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'
import { autoTable as AutoTable } from 'jspdf-autotable'
import { ColumnTableModel } from '../models/columnTable.model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class NgxTableService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, col: ColumnTableModel[]): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    var wscols = [];
    col.forEach(c =>  wscols.push({wch: c.flexGrow * 25 }));

    worksheet["!cols"] = wscols;

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);

  }

  private saveAsExcelFile(buffer: any, fileName: string): void {

    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });

    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);

  }

  public exportAsPdf(fileName, columns, rows, col: ColumnTableModel[]) {

    const doc = new jsPDF();
    
    const styles  = {};
    const avarageFlex = 182 / col.map(c => c.flexGrow).reduce((n1, n2) => n1 + n2);
    col.forEach((c, i)=> Object.assign(styles, { [i]: { cellWidth: c.flexGrow * avarageFlex }}));

    ((doc as any).autoTable as AutoTable)({
      head: columns,
      body: rows,
      columnStyles: styles,
      didDrawCell: (data) => {
        //console.log(data.column.index)
      },
    })
    doc.save(`${fileName + '_' + new Date().getTime()}.pdf`);
  }

}

