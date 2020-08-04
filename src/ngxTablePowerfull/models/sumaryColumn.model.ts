
export class SumaryColumnModel{
    public type: SumaryTypes = null;
    public unit: string = '';

	constructor(item?: Partial<SumaryColumnModel>) {
		if (!!item) {
            Object.assign(this, item);
		}
	}
}

export enum SumaryTypes {
    SUM = 0,
    AVERAGE,
    MAX,
    MIN
}


export const FunctionTypes = [
    { name: 'total', type: SumaryTypes.SUM },
    { name: 'avarage', type: SumaryTypes.AVERAGE },
    { name: 'maximum', type: SumaryTypes.MAX },
    { name: 'minimum', type: SumaryTypes.MIN },
];


