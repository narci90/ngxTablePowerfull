import { LanguageModel } from "./languageModelModel";

export class LanguageBuildModel{
    public name: string;
    public setting?: LanguageModel;

	constructor(item?: Partial<LanguageBuildModel>) {
		if (!!item) {
            Object.assign(this, item);
            this.setting = (!!item.setting) ? new LanguageModel(item.setting) : null;
		}
	}
}
