import { ColumnTableModel } from "./columnTable.model";

export class NotificationTableModel{
    public collapsed?: boolean = null;
    public rows?: Array<object> = null;
    public columns?: ColumnTableModel[] = null;
    public visibleDataTable: boolean = false;
    public dataTable: boolean = false;
    public exportExcel: boolean = false;
    public exportPdf: boolean = false;
    public resetSelection: boolean = false;

	constructor(item?: Partial<NotificationTableModel>) {
		if (!!item) {
            Object.assign(this, item);
            this.columns = (!!item.columns) ? item.columns.map(c => new ColumnTableModel(c)) : [];
		}
	}
}