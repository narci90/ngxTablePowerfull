import { Component, ViewChild, Input, Output, EventEmitter, HostListener, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { ColumnTableModel } from './models/columnTable.model';
import { NgxTableService } from './services/ngxTable.service';
import { NotificationNgxService } from './services/notificationNgx.service';
import { NgxTableDialogComponent } from './components/ngxTableDialog/ngxTableDialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NotificationTableModel } from './models/notificationTable.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { EditColumnDialogComponent } from './components/editColumnDialog/editColumnDialog.component';
import { ActionColumnType } from './common/actionsColumn.type';
import { ConfigTableModel, ClassesAvailable } from './models/configTable.model';
import { SumaryTypes, FunctionTypes } from './models/sumaryColumn.model';
import { ExportsType } from './common/exports.type';
import { ActionsType } from './common/actions.type';
import { GridColumnsComponent } from './components/gridColumns/gridColumns.component';
import { StylesTypes, ThemeTypes } from './common/styles.types';
import { DatePipe } from '@angular/common';
import { FilterByColumnsComponent } from './components/filterByColumns/filterByColumns.component';

@Component({
  selector: 'ngx-table-powerfull',
  templateUrl: './ngxTable.component.html',
  styleUrls: ['./ngxTable.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class NgxTableComponent  {

    @ViewChild('search', {static: false}) search: any;
    public temp: Array<object>;
    public rows: Array<object>;
    public backgroundActiveRow: string;
    public rowsTempTableAdd: string[];
    public indexColumn: string;
    public subscriptionChanges: Subscription;
    public fullscreen: boolean;
    public lastSortEvent: any;
    @Input() public name: string;
    @Input() public config: ConfigTableModel = new ConfigTableModel();
    @Input() public columns: ColumnTableModel[];
    @Input() public data: object[];
    @Input() public viewDialog: boolean = false;
    @Input() public beforeAction: () => Promise<boolean> = null;
    @Input() public actionsTocontrol: string[] = [];
    @Input() public selected: string;
    @Output() public event = new EventEmitter<any>();
    @Output() public click = new EventEmitter<any>();
    @Output() public dblclick = new EventEmitter<any>();
    @Output() public singleSelection = new EventEmitter<any>();
    @Output() public multipleSelection = new EventEmitter<any>();
    @Output() public visibleDataTable = new EventEmitter<any>();
    @Output() public dataTable = new EventEmitter<any>();
    @Output() public updateRow = new EventEmitter<any>();
    @Output() public newColumn = new EventEmitter<any>();
    @Output(ActionsType.EDIT_COLUMN) public editColumnOuput = new EventEmitter<any>();
    @Output(ActionsType.DELETE_COLUMN) public deleteColumnOuput = new EventEmitter<any>();

    public editing = {};
    public alt: boolean = false;
    public firstIndexAltKey: string;
    public asc: boolean = true;

    public columnsFilterList = [];
    public selectedColumnsFilter = [];
    public dropdownSettings: IDropdownSettings = {};

    public selectColumnsFilter: boolean = false;

    public primitiveHeight: any;
    public height: any = {};

    public indexNewColumn: number = 0;

    public sumaryColumns: ColumnTableModel[] = [];
    public dataSumary: Object[] = [];

    public defaultPropColumIndex = 'index_genrete_automatically_by_powerfull';

    public matchCase: boolean = false;
    public matchWholeWord: boolean = false;
    public parent = null;
    public searchByColumns: any = {};

    public getRowClass = (row: any) => {

        return {
          'row-active-add': this.rowsTempTableAdd.includes(row[this.indexColumn]) && !!this.config.multipleSelection,
          'row-active': (this.backgroundActiveRow == row[this.indexColumn] && !!this.config.singleSelection ) ? true : false
        };
     }

    constructor(
        private ngxTableService: NgxTableService,
        private notification: NotificationNgxService,
        private dialog: MatDialog,
        private datePipe: DatePipe,
        private viewContainerRef: ViewContainerRef
    ) {

        this.rowsTempTableAdd = [];
        this.fullscreen = false;
        this.temp = [];
        this.rows = [];
        this.indexColumn = '';
        this.lastSortEvent = null;
        this.parent = this.viewContainerRef.parentInjector['view'].component;

    }

    ngOnInit() {
        this.config = new ConfigTableModel(this.config);
        if(!ClassesAvailable.includes(this.config.classTable)) this.config.classTable = ClassesAvailable[0];
        this.setThemeStyles();
        this.buildIndex();
        this.checkPredefinedDataColumn();
        this.searchActions();
        this.getAll();

        this.buildFilterByColumns();

          this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: this.config.language.selectAll,
            unSelectAllText: this.config.language.unSelectAll,
            itemsShowLimit: 3,
            allowSearchFilter: true,
            searchPlaceholderText: this.config.language.search
        };

        this.primitiveHeight = (!!this.config.editableColumns) ? {fullscreen: 180,  fullscreenFilter: 220 } : {fullscreen: 150,  fullscreenFilter: 190 };

        this.height = {
            fullscreen: this.primitiveHeight.fullscreen,
            fullscreenFilter: this.primitiveHeight.fullscreenFilter        
        }

        this.sumaryColumns = this.columns.filter(c => !!new ColumnTableModel(c).sumary.length);
        this.updateSumaryColumns();

        this.matchCase = !!this.getLocalStorage('matchCase');
        this.matchWholeWord = !!this.getLocalStorage('matchWholeWord');

        this.backgroundActiveRow = !!this.selected ? this.selected : null;
    }

    ngAfterViewInit(): void {

        if(!!this.config.filter && !this.config.onlyTable){

            fromEvent(this.search.nativeElement, 'keydown')
            .pipe(
                debounceTime(550),
                map(x => x['target']['value'])
            )
            .subscribe(value => {
                this.updateFilter(value);
                this.updateSumaryColumns();
            });

        }

        this.columns.forEach(c =>{
            if(!!c.index) this.indexColumn = c.prop;
        });

        this.resize(300);
    }

    ngAfterViewChecked(){

        if(!!this.subscriptionChanges) return;

        this.subscriptionChanges = this.notification.on(this.name).subscribe( value =>{
            const data = new NotificationTableModel(value);

            if(data.collapsed != null) this.config.collapsed = data.collapsed;
            
            if(!!data.rows.length){
                this.data = data.rows;
                if(this.indexColumn == this.defaultPropColumIndex){
                    this.data.forEach((data, i) => {
                        data[this.defaultPropColumIndex] = i;
                    });
                }
                this.buildIndex();
                this.checkPredefinedDataColumn();
                this.searchActions();
                this.getAll();
                if(!!this.config.filter && !this.config.onlyTable && !!this.search.nativeElement.value) this.updateFilter(this.search.nativeElement.value);
                if(!!this.config.filterByColumns) this.applyFilteredByColumns();
                this.updateSumaryColumns();
            }

            if(!!data.columns.length) { 
                this.columns = data.columns;
                this.buildIndex();
                this.checkPredefinedDataColumn();
                this.searchActions();
                this.buildFilterByColumns();
                if(!!this.config.filter && !this.config.onlyTable && !!this.search.nativeElement.value) this.updateFilter(this.search.nativeElement.value);
                if(!!this.config.filterByColumns) this.applyFilteredByColumns();
                this.updateSumaryColumns();
            }

            if(!!data.visibleDataTable){

                const columnsProp = (this.columns.filter(c => !c.hide && !c.action && !!c.visible)).map(c => c.prop);
                this.visibleDataTable.emit({ 
                    name: ActionsType.VISIBLE_DATA_TABLE, 
                    columns: this.columns.filter(c =>  !c.hide && !c.action && !!c.visible), 
                    rows: this.rows.map(data => { 
                        let obj = {};
                        Object.keys(data).forEach( k => {
                            if(!!columnsProp.includes(k)){
                                Object.assign(obj, { [k]: data[k] });
                            }       
                        });

                        return obj;
                    })
                });
            }

            if(!!data.dataTable){

                const columnsProp = (this.columns.filter(c => !c.action )).map(c => c.prop);
                this.dataTable.emit({ 
                    name: ActionsType.DATA_TABLE, 
                    columns: this.columns.filter(c => !c.action), 
                    rows: this.data.map(data => { 
                        let obj = {};
                        Object.keys(data).forEach( k => {
                            if(!!columnsProp.includes(k)){
                                Object.assign(obj, { [k]: data[k] });
                            }       
                        });

                        return obj;
                    })
                });
            }

            if(!!data.exportExcel) this.export(ExportsType.EXCEL);
            if(!!data.exportPdf) this.export(ExportsType.PDF);

            if(!!this.config.filter && !this.config.onlyTable && !!this.search.nativeElement.value) this.updateFilter(this.search.nativeElement.value);
            if(!!this.config.filterByColumns) this.applyFilteredByColumns();
            this.resize(10);
        });

    }

    /**
     * onResize
     *
     * Calculates the height with the values ​​indicated in the table configuration
     *
     */
    @HostListener('window:resize', ['$event'])
    public onResize(event) {

        this.height = (event.target.innerWidth < 992) 
        ? { fullscreen: this.primitiveHeight.fullscreen + 55, fullscreenFilter: this.primitiveHeight.fullscreenFilter + 54 } 
        : { fullscreen: this.primitiveHeight.fullscreen, fullscreenFilter: this.primitiveHeight.fullscreenFilter };

    }

    /**
     * setThemeStyles
     *
     * Apply the styles indicated in the table config
     *
     */
    public setThemeStyles() {

        this.setPropertyCss(
            { key: StylesTypes.PRIMARY_COLOR, value: this.config.primaryColor },
            { key: StylesTypes.HOVER_ROW_COLOR, value: this.config.hoverRowColor },
            { key: StylesTypes.SECONDARY_COLOR, value: this.config.secondaryColor },
            { key: StylesTypes.HEADER_BACKGROUND, value: this.config.headerBackground },
            { key: StylesTypes.HEADER_FONT_COLOR, value: this.config.headerFontColor },
            { key: StylesTypes.BORDER_TABLE_COLOR, value: this.config.borderTableColor},
            { key: StylesTypes.HEADER_HEIGHT_COLUMN, value: (this.config.headerHeight - 20) + 'px' }
        );

        if(!this.config.resizeColumns || this.config.columnMode !== 'force') this.setPropertyCss({ key: StylesTypes.RESIZE_COLUMNS, value: 'none' });
        if(!this.config.visibleBorderHeader) this.setPropertyCss({ key: StylesTypes.VISIBLE_BORDER_HEADER, value: 'none'});

        if(this.config.classTable === ThemeTypes.MATERIAL ){
            this.setPropertyCss(
                { key: StylesTypes.DROPDOWN_BORDER, value: 'transparent' },
                { key: StylesTypes.DROPDOWN_BORDER_RADIUS, value: '0' },
                { key: StylesTypes.DROPDOWN_BORDER_BOTTOM, value: 'grey' },
                { key: StylesTypes.SETTING_WORD_MARGIN_RIGHT, value: '6px' },
                { key: StylesTypes.ANY_BACKGROUND_FILTER_BY_COLUMN, value: 'transparent'}
            );
        } else 
           this.setPropertyCss({ key: StylesTypes.BOX_SHADOW_TABLE, value: 'none' });

  
    }

    /**
     * setPropertyCss
     *
     * Notify css property
     *
     */
    public setPropertyCss(...property){
        property.forEach(p => document.documentElement.style.setProperty(p.key, p.value));
    }


    /**
     * setLocalStorage
     *
     * Store property in local storage
     *
     */
    public setLocalStorage(property: string){
        localStorage.setItem( `${property}-${this.name}`, this[property]);
    }

    /**
     * getLocalStorage
     *
     * Get property in local storage
     *
     */
    public getLocalStorage(property: string){

        switch (typeof this[property]) {
            case 'boolean':
                return localStorage.getItem( `${property}-${this.name}`) == 'true' ? true : false;
            default:
                return localStorage.getItem( `${property}-${this.name}`);

        }
    }

    /**
     * buildIndex
     *
     * Look for the index column, in addition to discarding if there are more and if there is not, generate one automatically
     *
     */
    public buildIndex(){

        let foundIndex = null;
        let indexColumn;
        this.columns = this.columns.map((col,i)=> {

            if(foundIndex != null && !!col.index) col.index = false;
            if(!!col.index) { 
                foundIndex = i;
                indexColumn = col;
            }
            
            return new ColumnTableModel(col);
        });

        if(foundIndex === null){

            const defaultProp = this.defaultPropColumIndex;
            let index = {
                prop: defaultProp,
                name: 'Index',
                index: true,
                hide: true
            };

            this.columns.splice(0, 0 , new ColumnTableModel(index));

            this.data.forEach((data, i) => {
                data[defaultProp] = i;
            });
            
        }else{
            if(foundIndex != 0){
                this.columns.splice(foundIndex, 1);
                this.columns.splice(0, 0 , new ColumnTableModel(indexColumn));
            }
        }

    }

    /**
     * onChangeSelectFilter
     *
     * Update search filter when changing column selection
     *
     */
    public onChangeSelectFilter(){
        this.updateFilter(this.search.nativeElement.value);
        this.updateSumaryColumns();
    }

    /**
     * openConfigFilter
     *
     * Open config and close config filter table
     *
     */
    public openConfigFilter(){
        this.selectColumnsFilter = !this.selectColumnsFilter;
        this.resize(10);

    }

    /**
     * buildFilterByColumns
     *
     * Build the list of items to show in the filter by columns
     *
     */
    public buildFilterByColumns(){
        this.columnsFilterList = this.selectedColumnsFilter = this.columns.filter( col => !col.hide && !col.action && !!col.visible && !!col.filtered).map( col => Object.assign({ item_id: col.prop, item_text: col.name}));
    }

    /**
     * searchActions
     *
     * Find columns with actions and build value and position finish
     *
     */
    public searchActions(){
        const columnsAction = this.columns.filter( c => !!c.action);

        if(!!columnsAction.length){
            columnsAction.forEach( c => {
                this.data.forEach( r => {
                    
                    let value = `<${c.tag}`;
                    
                    if(!!c.attributes.length){
                        c.attributes.forEach( a =>{
                            value += ` ${a.name}='${a.value}'`;
                        });
                    }

                    value +=`>${r[c.prop] || ''}</${c.tag}>`;
                    
                    r[c.prop] = value;
                });
            });
        }

        this.columns = this.columns.filter(c => !c.action);
        columnsAction.forEach(c => this.columns.push(c));
    }


    /**
     * onActivate
     *
     * Capture and manage the different events on the table for row selection
     *
     * @param e $event
     */
    public onActivate(e){

        if(e.type == ActionsType.CLICK || e.type == ActionsType.DBL_CLICK){ 

            if(!!this.config.singleSelection && !!this.backgroundActiveRow && (!!e.event.altKey || !!e.event.ctrlKey || !!e.event.shiftKey))
                this.singleSelection.emit({name: ActionsType.SINGLE_SELECTION, row: null});

            if(!e.event.shiftKey && !e.event.altKey && !e.event.ctrlKey){
                (this.backgroundActiveRow != e.row[this.indexColumn]) ? this.backgroundActiveRow = e.row[this.indexColumn] : ((e.type != ActionsType.DBL_CLICK) ? this.backgroundActiveRow = null : '');
                (e.type == ActionsType.CLICK) ? this.click.emit({name: e.type, row: e.row}) : this.dblclick.emit({name: e.type, row: e.row});
            }   

            if (e.event.ctrlKey && !this.viewDialog && !e.event.altKey && !!this.config.multipleSelection) {
                this.backgroundActiveRow = null;

               if (!!this.rowsTempTableAdd.includes(e.row[this.indexColumn])) {

                    this.rowsTempTableAdd.forEach( (r,i)=> { 
                        if( r === e.row[this.indexColumn]){
                            this.rowsTempTableAdd.splice(i,1);
                        }
                    })

                } else 
                    this.rowsTempTableAdd.push(e.row[this.indexColumn]);
            }

            if (e.event.altKey && !this.viewDialog && !e.event.ctrlKey && !!this.config.multipleSelection) {

                this.backgroundActiveRow = null;
        
                if(!!this.alt){

                    if(!!this.lastSortEvent) this.sortRows(this.lastSortEvent);

                    if(this.firstIndexAltKey === e.row[this.indexColumn]){
                        this.firstIndexAltKey = null;
                        this.alt = false;
                        this.rowsTempTableAdd.forEach((r,i) =>{
                            if(r ===  e.row[this.indexColumn]){
                                this.rowsTempTableAdd.splice(i,1);
                                return;
                            }
                        });
                        return;
                    }

                    let found = false;
                    this.rows.forEach( r => {
                        if(!!this.asc){
                            if(r[this.indexColumn] === e.row[this.indexColumn] && !!found){
                                found = false;
                                if(!this.rowsTempTableAdd.includes(e.row[this.indexColumn])) this.rowsTempTableAdd.push(e.row[this.indexColumn]);
                                return;
                            }
                        } else {
                            if(this.firstIndexAltKey === r[this.indexColumn] && !!found){
                                found = false;
                                return;
                            }
                        }


                        if(r[this.indexColumn] === this.firstIndexAltKey || r[this.indexColumn] === e.row[this.indexColumn] || !!found){
                            if(r[this.indexColumn] === e.row[this.indexColumn] && !found){
                                this.asc = false;
                                this.rowsTempTableAdd.push(r[this.indexColumn]);
                            }

                            (!!found) ? (!this.rowsTempTableAdd.includes(r[this.indexColumn]) ? this.rowsTempTableAdd.push(r[this.indexColumn]) : '' ) : found = true;
                        }
                    });

                    this.alt = false;
                    
                } else{
                    this.firstIndexAltKey = e.row[this.indexColumn];
                    if(!this.rowsTempTableAdd.includes(this.firstIndexAltKey)) this.rowsTempTableAdd.push(e.row[this.indexColumn]);
                    this.alt = true;
                    this.asc = true;
                }
                
            }

            if(!!e.event.shiftKey && !this.viewDialog && !e.event.ctrlKey && !!this.config.multipleSelection){
                this.rowsTempTableAdd = [];
                this.backgroundActiveRow = null;
                this.firstIndexAltKey = null;
                this.alt = false;
                this.asc = true;
            }

            if(!!e.event.altKey && !!e.event.ctrlKey && !!this.config.multipleSelection){
                this.rowsTempTableAdd = this.rows.map(r => r[this.indexColumn]);
                this.backgroundActiveRow = null;
            }
                
            if(!!this.config.multipleSelection && (!!e.event.altKey || !!e.event.ctrlKey || !!e.event.shiftKey)){
                this.multipleSelection.emit({ name: ActionsType.MULTIPLE_SELECTION, rows: this.rowsTempTableAdd.map(data => this.data.find( r => r[this.indexColumn] === data)) || [] });
            }

            if(!!this.config.singleSelection && !e.event.altKey && !e.event.ctrlKey && !e.event.shiftKey && (e.type == ActionsType.CLICK || e.type == ActionsType.DBL_CLICK )
                && !this.rowsTempTableAdd.includes(e.row[this.indexColumn])){
                this.singleSelection.emit({name: ActionsType.SINGLE_SELECTION, row: (!!this.backgroundActiveRow) ? e.row : null});
            }
            
        } 
    }

    /**
     * updateFilter
     *
     * Update the table values ​​when modifying the filter
     *
     * @param val input filter value
     */
    public updateFilter(val: any) {

        const value = val.toString().toLowerCase().trim();
        const columnsFilter = this.selectedColumnsFilter.map( c => c.item_id);
        const columnFormat = this.columns.filter(c => !!c.formatDate);
        
        this.rows = this.temp.filter(item => {

            return Object.keys(item).some( k => {

                if (!!columnsFilter.includes(k) 
                    && (item[k] 
                    && item[k]
                        .toString()
                        .toLowerCase()
                        .indexOf(value) !== -1) 
                    || (!!columnsFilter.includes(k) 
                        && !!columnFormat.some( c => c.prop == k 
                        && (this.datePipe.transform(
                            item[k], 
                            columnFormat.find(c => c.prop == k).formatDate))
                        .toString()
                        .toLowerCase()
                        .indexOf(value) !== -1))
                    || !value
                ) {
                    if(!!value){
                        const compareValue = (!!columnFormat.some( c => c.prop == k))
                            ? this.datePipe.transform(item[k], columnFormat.find(c => c.prop == k).formatDate).toString()
                            : item[k].toString().trim();
                        
                        if(!!this.matchWholeWord && !!this.matchCase && compareValue == val.toString().trim()){
                            return true;
                        } else if(!!this.matchCase && !this.matchWholeWord && compareValue.indexOf(val.toString().trim()) !== -1){
                            return true;
                        } else if(!this.matchCase && !!this.matchWholeWord && compareValue.toLowerCase() == val.toString().toLowerCase().trim()){
                            return true;
                        } else if(!this.matchWholeWord && !this.matchCase){
                            return true;
                        }
                    } else 
                        return true;
                } else
                    return false;
            });
        });

    }

    /**
     * onSort
     *
     * Recive the event when sorting the table
     */
    public onSort(event){
        this.lastSortEvent = event;
        this.sortRows(event);
    }

    /**
     * getAll
     *
     * Get all the records in the table
     */
    public getAll() {

        let data = this.data;

        this.temp = data;
        this.rows = [...this.temp];

    }

    /**
     * updateValue
     *
     * Update table cell value
     */
    public updateValue(event, cell, rowIndex) {
        let row = null;
        let column = null;
        let oldValue = null;
        let newValue = null;
        let result = false;

        this.editing[rowIndex + '-' + cell] = false;
        this.rows.forEach(async r => {
            if(r[this.indexColumn] === rowIndex ) { 
                column = this.columns.find( c => c.prop === cell );
                oldValue = r[cell];
                newValue = !!(column.formatDate) ? new Date(event.target.value) : (typeof oldValue == 'number' ? Number(event.target.value) : event.target.value);

                if(!!this.beforeAction && 
                    this.actionsTocontrol.includes(ActionsType.UPDATE_ROW) && 
                    !(await this.beforeAction.call(this.parent,{ name: ActionsType.UPDATE_ROW, row: Object.assign({}, r), cell: { column: column, oldValue: oldValue, newValue: newValue } }))) 
                        return;

                r[cell] = newValue;
                row = Object.assign({}, r);
                result = true;
            }
        });
        this.rows = [...this.rows];

        this.updateSumaryColumns();

        if(oldValue === newValue || !result) return;
        this.columns.filter(c => !!c.action).forEach( p => delete row[p.prop] );
        this.updateRow.emit({ name: ActionsType.UPDATE_ROW, row: row, cell: { column: column, oldValue: oldValue, newValue: newValue } });
    }

    /**
     * sendEvent
     *
     * Sending the name of the event and the row to the parent
     */
    public sendEvent(name: string, row: any){

        let action = {
            name: name,
            row: row
        };

        this.event.emit(action);
    }

    /**
     * toggleFullscreen
     *
     * Maximize table to full screen
     */
    public toggleFullscreen() {
        this.fullscreen = !this.fullscreen;
        this.resize(10);
    }

    /**
     * sortRows
     *
     * Sorts the rows as they are visually found in the table
     */
    public sortRows(sortEvent){
        
        let dir = "asc";
        let prop = "";

        if(!!sortEvent){

            dir = sortEvent.sorts[0].dir;
            prop = sortEvent.sorts[0].prop;
            const column = this.columns.find( c => c.prop === prop);

            this.rows.sort(function(a, b) {

                try {
                    if(typeof a[prop] == 'number' && typeof b[prop] == 'number'){

                        return (dir == 'asc') ?  a[prop] - b[prop] : b[prop] - a[prop];

                    } else if((typeof a[prop] == 'number' && typeof b[prop] != 'number') || (typeof a[prop] != 'number' && typeof b[prop] == 'number') ){

                        return (dir == 'asc') 
                        ? typeof a[prop] == 'number' 
                            ? 1 
                            : -1
                        : typeof a[prop] == 'number'   
                            ? -1
                            : 1

                    } else if(!!column.formatDate){

                        const f1 = new Date(a[prop]).getTime();
                        const f2 = new Date(b[prop]).getTime();
                        return (dir == 'asc') ?  f1 - f2 : f2 - f1;

                    } else {

                        let res = (a[prop].localeCompare(b[prop], undefined, { numeric: column.sort.numeric }));
                        return (dir == 'asc') ? res : -1*res;
                        
                    }
            
                } catch (err) {
          
                    console.warn("Extended localeCompare() not supported in this browser.");
                    return(a[prop].toString().localeCompare(b[prop]));
            
                }
            });

        }
    }

    /**
     * export
     *
     * Build the object for export file and call the service to export it
     */
    public export(type: ExportsType){

        let columnsExport = this.columns.filter( c => !c.hide && !c.action && !!c.visible);

        switch(type){
            case ExportsType.EXCEL:
                let dataExport = [];

                if(!!this.lastSortEvent) this.sortRows(this.lastSortEvent);
        
                this.rows.forEach( row => { 
                    let obj = {};
                    columnsExport.forEach( column =>{
                        obj[column.name] = !!(column.formatDate) ? this.datePipe.transform(row[column.prop], column.formatDate) : row[column.prop];
                    });
        
                    dataExport.push(obj);
                });
        
                this.ngxTableService.exportAsExcelFile(dataExport, this.name, columnsExport);
                break;

            case ExportsType.PDF:

                let nameColumns = columnsExport.map( c => c.name);
                let rowsExportPdf = this.rows.map(r => {
                    let row = [];
                    columnsExport.forEach( c => {
                        row.push(!!(c.formatDate) ? this.datePipe.transform(r[c.prop], c.formatDate) : r[c.prop]);
                    });
                    return row;
                });
        
                this.ngxTableService.exportAsPdf(this.name, [nameColumns], rowsExportPdf, columnsExport);
                break;

            default:    

        }
    }

    /**
     * openDialog
     *
     * Build a dialog with the selected elements 
     */
    public openDialog(){
        const rows = this.rowsTempTableAdd.map( data => this.data.find( r => r[this.indexColumn] === data));

        this.dialog.open(NgxTableDialogComponent, {
            width: '80vw',
            height: 'auto',
            data: {
                name: this.name + ' ' + this.config.language.generated,
                rows: rows,
                columns: this.columns,
                config: this.config
            }
        });
    }

    /**
     * closeDialog
     *
     * Close dialog
     */
    public closeDialog(){
        this.dialog.closeAll();
        this.resize(100);
    }

    /**
     * resize
     *
     * Resize table
     */
    public resize(time: number){
        setTimeout(() => window.dispatchEvent(new Event('resize')),time);
    }

    /**
     * addColumn
     *
     * Add a new column to the table
     */
    public addColumn(){
        
        this.dialog.open(EditColumnDialogComponent, {
            width: '40vw',
            height: 'auto',
            data: {
                action: ActionColumnType.ADD,
                nColumns: this.columns.filter( c => (!c.hide && !c.action)).length + 1,
                config:  this.config
            }
  
          }).afterClosed().subscribe(async result => {
  
            if(!!result && !!result.name && !!result.name.length){
                const functionsType = FunctionTypes;
                const functions = []; 
                result.functions.map((f, i) => {
                    if(!!f){
                        functions.push({ type: functionsType[i].type, unit: (!!result.unitsFuntions[i]) ? result.unitsFuntions[i] : '' });
                    }
                });
  
                const newColumn = {
                  prop: `c-${this.indexNewColumn}`,
                  name: result.name.charAt(0).toUpperCase() + result.name.slice(1),
                  editable: result.editable,
                  sumary: functions,
                  predefinedData: result.predefined
                };
                
                if(!!this.beforeAction && this.actionsTocontrol.includes(ActionsType.NEW_COLUMN) && !(await this.beforeAction.call(this.parent,{ name: ActionsType.NEW_COLUMN, column: new ColumnTableModel(newColumn) }))) return;

                this.data.forEach(r  => Object.assign(r, { [newColumn.prop] : result.predefined }));
      
                const newPosition = (!this.columns[0].hide) ? result.position - 1 : result.position;
                if(newPosition == this.columns.length)
                    this.columns.push(new ColumnTableModel(newColumn));
                else
                    this.columns.splice(newPosition, 0 , new ColumnTableModel(newColumn));

                this.indexNewColumn ++;
                this.buildFilterByColumns();

                const numSumaryColumns = !!this.sumaryColumns.length;
                this.sumaryColumns = this.columns.filter(c => !!c.visible && !!new ColumnTableModel(c).sumary.length);
                this.updateSumaryColumns();
                if(numSumaryColumns !== !!this.sumaryColumns.length) this.resize(10);


                this.newColumn.emit({ name: ActionsType.NEW_COLUMN, column: new ColumnTableModel(newColumn) });
            }
  
          });;
    }

    /**
     * editColumn
     *
     * Edit a column from the table
     */
    public editColumn(){
        
        this.dialog.open(EditColumnDialogComponent, {
            width: '40vw',
            height: 'auto',
            data: {
                action: ActionColumnType.EDIT,
                columns: this.columns.filter( c => (!c.hide && !c.action)),
                config: this.config
            }
  
          }).afterClosed().subscribe(async result => {

            if(!!result && !!result.name && !!result.name.length && !!result.column){

                const functionsType = FunctionTypes;
                const functions = []; 
                result.functions.map((f, i) => {
                    if(!!f){
                        functions.push({ type: functionsType[i].type, unit: (!!result.unitsFuntions[i]) ? result.unitsFuntions[i] : '' });
                    }
                });

                const newPosition = (!this.columns[0].hide) ? result.newPosition - 1 : result.newPosition;
                const selecColumn = (!this.columns[0].hide) ? result.column - 1 : result.column;
                const oldColumn = Object.assign({}, this.columns[selecColumn]);

                const columnTempReview = Object.assign({}, oldColumn);
                columnTempReview.name = result.name;
                columnTempReview.editable = result.editable;
                columnTempReview.sumary = functions;

                if (!!this.beforeAction && 
                    this.actionsTocontrol.includes(ActionsType.EDIT_COLUMN) && 
                    !(await this.beforeAction.call(this.parent,{ name: ActionsType.EDIT_COLUMN, oldColumn: oldColumn, updatedColumn: new ColumnTableModel(columnTempReview) }))) 
                        return;

                this.columns[selecColumn].name = result.name;
                this.columns[selecColumn].editable = result.editable;
                this.columns[selecColumn].sumary = functions;

                const columnTemp = this.columns.splice(selecColumn, 1);

                if(newPosition == this.columns.length)
                    this.columns.push(new ColumnTableModel(columnTemp[0]));
                else
                    this.columns.splice(newPosition, 0 , new ColumnTableModel(columnTemp[0]));

                

                this.columnsFilterList = this.selectedColumnsFilter = this.columns.filter( col => !col.hide && !col.action && !!col.visible && !!col.filtered).map( col => Object.assign({ item_id: col.prop, item_text: col.name }));
                
                const numSumaryColumns = !!this.sumaryColumns.length;
                this.sumaryColumns = this.columns.filter(c => !!c.visible && !!new ColumnTableModel(c).sumary.length);
                this.updateSumaryColumns();
                this.editColumnOuput.emit({ name: ActionsType.EDIT_COLUMN, oldColumn: oldColumn, updatedColumn: new ColumnTableModel(columnTemp[0]) });

                if(numSumaryColumns !== !!this.sumaryColumns.length) this.resize(10);
            }

          });;
    }


    /**
     * deleteColumn
     *
     * Remove a column from the table
     */
    public deleteColumn(){
        
        this.dialog.open(EditColumnDialogComponent, {
            width: '40vw',
            height: 'auto',
            data: {
                action: ActionColumnType.DELETE,
                columns: this.columns.filter( c => (!c.hide && !c.action)),
                config: this.config
            }
  
          }).afterClosed().subscribe(async result => {

            if(!!result && !!result.column){
                const selecColumn = (!this.columns[0].hide) ? result.column - 1 : result.column;
                const idColumn = this.columns[selecColumn].prop;
                
                if(!!this.beforeAction && this.actionsTocontrol.includes(ActionsType.DELETE_COLUMN) && !(await this.beforeAction.call(this.parent,{ name: ActionsType.DELETE_COLUMN, column: this.columns[selecColumn] }))) return;

                const deleteColumn = this.columns.splice(selecColumn, 1);
                this.buildFilterByColumns();
                this.rows.forEach(r  => delete r[idColumn]);

                const numSumaryColumns = !!this.sumaryColumns.length;
                this.sumaryColumns = this.columns.filter(c =>  !!c.visible && !!new ColumnTableModel(c).sumary.length);
                this.updateSumaryColumns();
                this.updateFilter(this.search.nativeElement.value);
                this.applyFilteredByColumns();
                this.deleteColumnOuput.emit({ name: ActionsType.DELETE_COLUMN, column: deleteColumn[0] });

                if(numSumaryColumns !== !!this.sumaryColumns.length) this.resize(10);
            }

          });
    }


    /**
     * updateSumaryColumns
     *
     * Update the data of the sumary displayed in the footer
     */
    public updateSumaryColumns(){

        this.dataSumary = [];
        this.sumaryColumns.forEach( c => {
            c.sumary.forEach(sumary =>{

                switch(sumary.type){
                    case SumaryTypes.SUM:
                        let sum = 0;
                        this.rows.forEach(r =>{
                            if(!!this.isNumeric(r[c.prop])) sum += parseFloat(r[c.prop]);
                        });
                        this.dataSumary.push({ text: this.config.language.total,  column: c.name ,data: sum, unit: sumary.unit});
                        break;

                    case SumaryTypes.AVERAGE:
                        let  elements = 0;
                        let  total = 0
                        this.rows.forEach(r =>{
                            if(!!this.isNumeric(r[c.prop])){
                                total += parseFloat(r[c.prop]);
                            }
                            elements ++;
                        });
                        this.dataSumary.push({ text: this.config.language.avarage,  column: c.name ,data: (!!total) ? (total/elements).toFixed(2) : 0, unit: sumary.unit});
                        break;  

                    case SumaryTypes.MAX:
                        let max = 0;
                        this.rows.forEach(r =>{
                            if(!!this.isNumeric(r[c.prop]) && parseFloat(r[c.prop]) > max ) max = parseFloat(r[c.prop]);
                        });
                        this.dataSumary.push({ text: this.config.language.maximum,  column: c.name ,data: max, unit: sumary.unit});
                        break;   

                    case SumaryTypes.MIN:
                        let min = (!!this.rows.length && !!this.isNumeric(this.rows[0][c.prop])) ? parseFloat(this.rows[0][c.prop]) : 0;
                        this.rows.forEach(r =>{
                            if(!!this.isNumeric(r[c.prop]) && parseFloat(r[c.prop]) < min ) min = parseFloat(r[c.prop]);
                        });
                        this.dataSumary.push({ text: this.config.language.minimum,  column: c.name ,data: min, unit: sumary.unit});
                        break;                         
                        
                    default:
                            
                }

            });
        });
    }

    /**
     * isNumeric
     *
     * Check if a data is numeric
     */
    public isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    /**
     * checkPredefinedDataColumn
     *
     * Enter default data to columns that have the predefinedData property only if it is not already defined in the row
     */
    public checkPredefinedDataColumn(){
        const columnsPredefinedData = this.columns.filter(c => !!c.predefinedData);
        columnsPredefinedData.forEach(c => {
            this.data.forEach(r => {
                if(!r.hasOwnProperty(c.prop)) r[c.prop] = c.predefinedData;
            });
        });

    }

    /**
     * configureColumns
     *
     * Open the modal to configure the visibility, order and option to set columns
     */
    public configureColumns(): void {
        const dialogConfig = Object.assign(new MatDialogConfig(), {
            disableClose: true,
            autoFocus: true,
            top: 0,
            right: 0,
            panelClass: 'right-fixed',
            data: {
                columns: this.columns.filter(col => !col.hide && !col.action),
                config: this.config
            }
        });
        const dialog = this.dialog.open(GridColumnsComponent, dialogConfig);
        dialog.afterClosed().subscribe(data => {
            if(!data) return;
            
            let columns = [];
            this.columns.forEach( c => {
                if(!!c.hide) columns.push(new ColumnTableModel(c));
            });

            data.forEach(c => columns.push(new ColumnTableModel(c)));

            this.columns.forEach(c => {
                if(!!c.action) columns.push(new ColumnTableModel(c));
            });

            this.columns = columns;
            this.buildFilterByColumns();

            const numSumaryColumns = !!this.sumaryColumns.length;
            this.sumaryColumns = this.columns.filter(c => c.visible && !!new ColumnTableModel(c).sumary.length);
            this.updateSumaryColumns();
            if(numSumaryColumns !== !!this.sumaryColumns.length) this.resize(10);
           
        });
    }

    /**
     * filterByColumns
     *
     * Open the side dialog for the filter by columns
     */
    public filterByColumns(){
        const dialogConfig = Object.assign(new MatDialogConfig(), {
            disableClose: true,
            autoFocus: true,
            top: 0,
            right: 0,
            panelClass: 'right-fixed-filter',
            data: {
                columns: this.columns.filter(col => !col.hide && !col.action),
                config: this.config,
                parent: this.parent,
                oldSearch: this.searchByColumns
            }
        });
        const dialog = this.dialog.open(FilterByColumnsComponent, dialogConfig);
        dialog.afterClosed().subscribe(data => {

            if(!data) return;
           
            this.searchByColumns = data;
            this.applyFilteredByColumns();
        });

    }

     /**
     * applyFilteredByColumns
     *
     * Filter to search for a data for each column and to be able to extract data more exactly
     */
    public applyFilteredByColumns(){
        
        const columnFormat = this.columns.filter(c => !!c.formatDate);
        const columnsFilter = this.selectedColumnsFilter.map( c => c.item_id);
        const search =  Object.keys(this.searchByColumns).filter( k => !!columnsFilter.includes(k));

        this.rows = this.temp = this.data.filter(item => {

            return search.every( k => {

                if(!!this.searchByColumns[k] && !!item.hasOwnProperty(k)){
                    
                    const column = columnFormat.find(c => c.prop == k);

                    return !!column
                        ? (this.datePipe.transform(new Date(this.searchByColumns[k]), column.formatDate).toString())
                            .indexOf(this.datePipe.transform(item[k], column.formatDate).toString()) !== -1
                        : this.searchByColumns[k].indexOf(item[k].toString().trim()) !== -1;
                } else
                    return true;
                
            });

        });

        this.updateFilter(this.search.nativeElement.value);
        this.updateSumaryColumns();
    }

     /**
     * hasDataFilterByColumns
     *
     * Validation that checks if the filter by columns is active
     */
    public get hasDataFilterByColumns(){
        return !!this.searchByColumns && !!Object.keys(this.searchByColumns).length && !!Object.keys(this.searchByColumns).some(k => !!this.searchByColumns[k]);
    }

    ngOnDestroy(){
        if(!!this.subscriptionChanges) this.subscriptionChanges.unsubscribe();
    }

}