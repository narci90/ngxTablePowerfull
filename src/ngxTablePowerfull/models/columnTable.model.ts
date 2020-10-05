import { TemplateRef } from '@angular/core';
import { AttributesModel } from "./attributes.model";
import { FieldModel } from './field.model';
import { SortTableModel } from "./sortTable.model";
import { SumaryColumnModel } from "./sumaryColumn.model";

export class ColumnTableModel{
    public prop: string;
    public name: string;
    public action: string = null;
    public formatDate: string;
    public index: boolean = false;
    public hide: boolean = false;
    public tag: TagTypes | string = null;
    public attributes: AttributesModel[] = [];
    public editable: boolean = false;
    public sortable: boolean = true;
    public flexGrow: number = 1;
    public sort: SortTableModel = new SortTableModel({ numeric: true});
    public tooltip: boolean = false;
    public tooltipText: string = '';
    public sumary: SumaryColumnModel[] = [];
    public predefinedData: any = null;
    public visible: boolean = true;
    public fixed: boolean = false;
    public filtered: boolean = true;
    public field: FieldModel;
    public showInDialogContent: boolean = false;
    public dialogContentView: string = null;
    public alignText: string = 'left';

	constructor(item?: Partial<ColumnTableModel>) {
		if (!!item) {
            Object.assign(this, item);
            this.attributes = (!!item.attributes) ? item.attributes.map( a => new AttributesModel(a)) : [];
            this.sort = (!!item.sort) ? new SortTableModel(item.sort) : new SortTableModel({ numeric: true });
            (item.sumary || []).map( s => new SumaryColumnModel(s));
            this.hide = (!!item.index) ? item.hide :  false;
		}
	}
}

export enum TagTypes {
    ICON = 'i',
    LINK = 'a',
    BUTTON = 'button'
}

