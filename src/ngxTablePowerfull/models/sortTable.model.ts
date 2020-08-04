

export class SortTableModel{
    public numeric: boolean;

	constructor(item?: Partial<SortTableModel>) {
		if (!!item) {
            Object.assign(this, item);
		}
	}
}
