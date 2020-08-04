export class AttributesModel{
    public name: AttributesTypes | string;
    public value: string;


	constructor(item?: Partial<AttributesModel>) {
		if (!!item) {
            Object.assign(this, item);
		}
	}
}

export enum AttributesTypes {
    CLASS = 'class',
    HREF = 'href',
    ID = 'id',
    STYLE = 'style'
}
