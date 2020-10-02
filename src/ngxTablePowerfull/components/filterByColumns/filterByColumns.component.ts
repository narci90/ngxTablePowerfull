import { Component, Inject, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FieldsType } from 'src/ngxTablePowerfull/common/fields.type';

@Component({
    selector: 'filter-by-columns-component',
    templateUrl: './filterByColumns.component.html',
    styleUrls: ['./filterByColumns.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class FilterByColumnsComponent {
    public columns: any[] = [];
    public description: string = '';
    public obj: Object = {};
    public temp: Object = {};
    public loadData: boolean = false;
    public fieldsType: any = FieldsType;

    constructor( private dialogRef: MatDialogRef<FilterByColumnsComponent>,@Inject(MAT_DIALOG_DATA) public data) {

        this.columns = data.columns.map(d => Object.assign({}, d));
        this.temp = data.oldSearch;
    }

    ngOnInit() { 

        this.columns.forEach(async c => {

            Object.assign(this.obj, { [c.prop]: this.temp[c.prop] || null });

            if(!c.field){
                Object.assign(c, { field: { type: FieldsType.TEXT, size: 12 }});
            } else {
                if(!c.field.type) Object.assign(c.field, { type: FieldsType.TEXT });
                if(!c.field.size) Object.assign(c.field, { size: 12 });

                if(c.field.type == FieldsType.SELECT){
                    c.field.options = !!c.field.options 
                        ? c.field.options 
                        : !!c.field.method 
                            ? await this.data.parent[c.field.method](c.field.methodFiltered || null)
                            : [];
                }
            }

        });

        this.loadData = true;

    }

    public save() {
        this.dialogRef.close(this.obj);
    }

    public close() {
        this.dialogRef.close();
    }


}
