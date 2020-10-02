import { LanguageModel } from "./languageModelModel";
import { Language } from "../common/language";
import { LanguageBuildModel } from "./languageBuid.model";

export class ConfigTableModel{

    public visibleTitle: boolean = true;
    public filter: boolean = true;
    public filterByColumn: boolean = true;
    public filterByColumns: boolean = true;
    public fullscreen: boolean = true;
    public exportExcel: boolean = true;
    public exportPdf: boolean = true;
    public editableColumns: boolean = true;
    public configureColumns: boolean = true;
    public addColumn: boolean = true;
    public editColumn: boolean = true;
    public deleteColumn: boolean = true;
    public sortable: boolean = true;
    public resizeColumns: boolean = true;
    public columnMode: string = 'force';
    public limitResult: number = 0;
    public striped: boolean = true;
    public singleSelection: boolean = true;
    public multipleSelection: boolean = true;
    public multipleButtonText: string = '';
    public visibleNumberRowsButton: boolean = true;
    public viewDialogTable: boolean = true;
    public collapsed: boolean = false;
    public subtractHeight: number = 550;
    public subtractHeightCollapsed: number = 788;
    public minHeight: number = 300;
    public positionSumary: string = 'left';
    public primaryColor: string = '#17703E';
    public secondaryColor: string = '#EC7063'
    public hoverRowColor: string = '#0066363d';
    public headerBackground: string = '#fff';
    public headerFontColor: string = '#757575';
    public visibleBorderHeader: boolean = false;
    public borderTableColor: string = '#EEEFF0';
    public cardBody: boolean = true;
    public rowHeight: number = 50;
    public footerHeight: number = 50;
    public sumaryFooterHeight: number = 50;
    public headerHeight: number = 50;
    public classTable: string = 'boostrap';
    public language: LanguageModel = new LanguageBuildModel(Language[0]).setting;
    public onlyTable: boolean = false;
    public matchWordButtons: boolean = true;
    
	constructor(item?: Partial<ConfigTableModel>) {
		if (!!item) {
            Object.assign(this, item);
            if(!!item.language) (!!(item.language instanceof LanguageModel)) ? this.language = new LanguageModel(item.language) : this.buildLanguage(item.language);
            this.multipleButtonText = (!!item.multipleButtonText) ? item.multipleButtonText : this.language.visualize; 
        }
        
    }

    private buildLanguage(language: LanguageBuildModel){
        if(!language.name) return;
        const languageSelect = Language.find(l => l.name === language.name) || null;

        if(!!languageSelect)
            this.language = (!!language.setting) ? Object.assign(new LanguageModel(languageSelect.setting), language.setting) : new LanguageModel(languageSelect.setting);
        else 
            this.language = new LanguageModel(language.setting);
    
    }

}

export const ClassesAvailable: string[] = ['boostrap', 'material'];
