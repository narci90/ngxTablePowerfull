export class LanguageModel{

    public selectColumns: string = '';
    public filterResults: string = '';
    public rows: string = '';
    public row: string = '';
    public emptyMessage: string = '';
    public selectAll: string = '';
    public unSelectAll: string = '';
    public search: string = '';
    public generated: string = '';
    public total: string = '';
    public avarage: string = '';
    public maximum: string = '';
    public minimum: string = '';
    public deleteRow: string = '';
    public close: string = '';
    public save: string = '';
    public column: string = '';
    public columns: string = '';
    public show: string = '';
    public fix: string = '';
    public name: string = '';
    public predefinedContent: string = '';
    public position: string = '';
    public newPosition: string = '';
    public editable: string = '';
    public applyFunction: string = '';
    public units: string = '';  
    public accept: string = '';
    public configureFilter: string = '';
    public closeConfigure: string = '';
    public configureColumns: string = '';
    public editColumn: string = '';
    public newColumn: string = '';
    public deleteColumn: string = '';
    public export: string = '';
    public maximize: string = '';
    public restore: string = '';
    public visualize: string = '';
    public matchWholeWord: string = '';
    public matchCase: string = '';
    
	constructor(item?: Partial<LanguageModel>) {
		if (!!item) {
            Object.assign(this, item);
		}
    }

}
