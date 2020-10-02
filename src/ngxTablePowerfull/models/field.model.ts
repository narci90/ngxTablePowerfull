import { FieldsType } from '../common/fields.type';

export class FieldModel{

    public type: FieldsType | string;
    public size: number;
    public options: string[];
    public method: string;
    public methodFiltered: any;

	constructor(item?: Partial<FieldModel>) {
		if (!!item) {
            Object.assign(this, item);
		}
	}
}
