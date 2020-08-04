=
       INSTALLATION 


1. Installation of ngx-datatable

npm i @swimlane/ngx-datatable --save

=====================================================

2. Installation Bootstrap

npm install bootstrap

=====================================================

2. Add Material your node-modules

ng add @angular/material

=====================================================

3. Installation Multiselect Dropdown

npm install ng-multiselect-dropdown


=====================================================

4. Installation Export to Excel

 npm install xlsx

npm install file-saver --save

=====================================================

5. Installation Export to PDF

npm install jspdf --save

npm install jspdf jspdf-autotable




=
           ADD


1. import NgxTablePowerfullModule of 'ngxTablePowerfull/'ngxTablePowerfull.module' in your imports module
2. import NotificationNgxService of 'ngxTablePowerfull/services/notificationNgxService.service' in your component for use services update table


============================
    DEFAULT CONFIG TABLE
============================

    visibleTitle: true
    filter: true
    filterByColumn: true
    fullscreen: true
    exportExcel: true
    exportPdf: true
    editableColumns: true
    addColumn: true
    editColumn: true
    deleteColumn: true
    sortable: true
    resizeColumns: true
    columnMode: 'force'
    limitResult: 0
    striped: true
    singleSelection: true
    multipleSelection: true
    multipleButtonText: 'Visualizar'
    visibleNumberRowsButton: true
    viewDialogTable: true
    collapsed: false
    subtractHeight: 550                  // Subtract the specified pixels in the two heights to the default height which is 100vh
    subtractHeightCollapsed: 780         // Subtract px collapsed
    minHeight: 0
    positionSumary: 'left'
    cardBody: true;
    primaryColor: '#17703E'
    secondaryColor: '#EC7063'
    hoverRowColor: '#0066363d'
    headerBackground: '#fff';
    headerFontColor: '#757575'
    visibleBorderHeader: false
    borderTableColor: '#EEEFF0'
    rowHeight: 50 // Number
    footerHeight: 50 // Number
    sumaryFooterHeight: 50 // Number
    headerHeight: 50 // Number
    classTable: 'boostrap'               // Only supports 'boostrap' or 'material'
    language: { name: 'spanish' }        // Only values 'spanish' or 'english'. * If you want a new language or modify the existing one, you must configure it as indicated on line 100,
    onlyTable: false                     // If it is specified in true it only shows the block of the table
    matchWordButtons: true               // Hide or show the buttons to filter by whole words and distinguish in upper and lower case


=
   CONFIGURE NEW LANGUAGE OR MODIFY ONE THAT ALREADY EXISTS


    selectColumns: 'Select Columns',
    filterResults: 'Filter results',
    rows: 'Rows',
    row: 'Row',
    emptyMessage: 'No data to display',
    selectAll: 'Select All',
    unSelectAll: 'UnSelect All',
    search: 'Search',
    generated: 'Generated',
    total: 'Total',
    avarage: 'Average',
    maximum: 'Maximum',
    minimum: 'Minimum',
    deleteRow: 'Delete row',
    close: 'Close',
    save: 'Save',
    column: 'Column',
    columns: 'Columns',
    show: 'Show',
    fix: 'Fix',
    name: 'Name',
    predefinedContent: 'Predefined content',
    position: 'Position',
    newPosition: 'New position',
    editable: 'Editable',
    applyFunction: 'Apply function',
    units: 'Unit',   
    accept: 'Accept',
    configureFilter: 'Configure filter',
    closeConfigure: 'Close setting',
    configureColumns: 'Configure column',
    editColumn: 'Edit columns',
    newColumn: 'New column',
    deleteColumn: 'Delete column',
    export: 'Export',
    maximize: 'Maximize',
    restore: 'Restore',
    visualize: 'Visualize',
    matchWholeWord: 'Match whole word',
    matchCase: 'Match case'


    1. MODIFY LANGUAGE / TEXTS
        If you want to modify an existing language, you must indicate the name of the language and the properties you want to change without having to instantiate all of them.

        - Example: 
            language: 
            { 
                name: 'english',
                setting: {
                    configureColumns: 'Columns',
                    visualize: 'Show',
                    position: 'Place'
                }
            }

    2. NEW LANGUAGE
        If you want to create a new language, you must indicate a name, and the properties, for a new language you must include all the properties mentioned above, without exception or the table could be affected

        - Example:
            language: 
            { 
                name: 'italian',
                setting: {
                    selectColumns: 'Seleziona Colonne',
                    filterResults: 'Filtra i risultati',
                    ...
                    ...                                         // Include all the properties for a new language
                    ...                                         
                    visualize: 'Visualize'
                }
            }

=
       CONFIG COLUMN


    prop: 'id-column'
    name: 'name-column'
    action: 'name-action'                                         // Columns with actions will be automatically positioned at the end and they will not be exported in any kind of event or action
    formatDate: 'format'                                          // Format for data type Date (* Date type is not controlled without an associated format *)(Only formats supported by Date pipe)
    index: false                                                  // Property that indicates the index column of the table, there can only be one column of this type. If it is not found, an automatic one will be generated.
    hide: false                                                   // It only applies in the index column, showing it or not
    tag: 'tag-type'                                               // Only applies to columns with any action
    attributes: [name: 'name-atribute', value: 'value-atribute']  // Only applies to columns with any action
    editable: false
    sortable: true
    flexGrow: 1
    sort: { numeric: true }
    tooltip: false
    tooltipText: ''                                                // Default text row value   
    sumary: [ { type: 1, unit: 'kg/m/mm/l...'} ]                   // Available type functions: 0 :'total', 1: 'avarage', 2: 'maximum' and 3: 'minimum'
    predefinedData: 'data'                                         // Predefined data for the column if the property does not exist in the data model
    visible: true
    fixed: false,
    filtered: true

    - Example build columns table:

    const columns= [
        {
            prop: 'id',
            name: 'Id',
            index: true,
            hide: true
        },
        {
            prop: 'name',
            name: 'Name'
        },
        {
            prop: 'weight',
            name: 'Weight',
            sumary: [
                {
                    type: 0,
                    unit: 'Kg'
                },
                {
                    type: 1,
                    unit: 'Kg'
                }
            ]
        },
        {
            prop: 'delete',
            name: '',
            action: 'delete',
            predefinedData: 'delete',
            tooltip: true,
            tooltipText: 'Delete Row',
            tag: 'i',
            attributes: [ 
                {
                    name: 'class',
                    value: 'material-icons delete-icon'
                } 
            ]
        }
    ];



=
    TABLE INPUT PROPERTIES


    [name]="name table"
    [config]="object config of table"                                                  // This property is optional if it is not included it will start with the default configuration mentioned above on line 58
    [coloumns]="Array de object columns"
    [data]="Array of data table"
    [beforeAction]="Name of your component function"                                   // You must indicate the name of the function of your component that will be called before performing the action, it must return a promise of 
                                                                                       // type boolean, to continue the action (true) or stop it (false). Your function will receive a parameter with the name of the action and the 
                                                                                       // affected rows or columns  

    [actionsTocontrol]="Array of actions that will call name function of beforeAction" // Actions available to control by the user before being executed. [actionsTocontrol]="['newColumn', 'editColumn', 'deleteColumn', 'updateRow']"


    - Example instantiate simple table:

            <ngx-table-powerfull [name]="'Name Of Table'" [columns]="columns" [data]="rows" [config]="tableConfig" ></ngx-table-powerfull>     // Custom configuration

            <ngx-table-powerfull [name]="'Name Of Table'" [columns]="columns" [data]="rows" ></ngx-table-powerfull>                            // Default configuration

    - Example with beforeAction:        

        // Html
        <ngx-table-powerfull [name]="'Name Of Table'" [columns]="columns" [data]="rows"  [beforeAction]="myFuncion" [actionsTocontrol]="['editColumn', 'updateRow']"></ngx-table-powerfull> 

        // Component

        myFuncion(action): Promise<boolean>{

            return new Promise<boolean>(async (resolve) => {

                if(action.name === 'updateRow' && action.cell.oldValue > action.cell.newValue){
                    resolve(true);
                } else {
                    resolve(false);
                }

                if(action.name === 'editColumn' && !!action.updatedColumn.editable){
                    resolve(true);
                } else {
                    resolve(false);
                }
            });

        }

=
       EVENT TABLE


    (event)             // Name action of column + Row
    (click)             // name action + Row click
    (dblclick)          // name action + Row double click
    (singleSelection)   // name action + Row selected | null
    (multipleSelection) // name action + Rows selected [n] | []
    (updateRow)         // name action + update row +  update cell (cell: { column: update column, oldValue: old value, newValue: new value })
    (newColumn)         // name action + new column
    (editColumn)        // name action + old column + updated column
    (deleteColumn)      // name action + delete column
    *(visibleDataTable) // name action + (columns + rows) table data in view state (without action columns) 
    *(dataTable)        // name action + (columns + rows) table with the collected changes but with all the columns and records of this (without action columns)

    * It is necessary at the time of the request to send notification to the table with the property visibleDataTable: true | dataTable: true

=
 NOTIFICATION SYSTEM TO THE TABLE


import NotificationNgxService of 'Services og NgxTablepowerfull module';

Notification service provided by the one provided by the NgxTablepowerfull module itself called NotificationNgxService, accepts the following properties:

    collapsed: true | false  // Collapsed the table or not according to the value
    rows: [datas]            // Updates the data in the table view with the new values ​​entered
    columns: [columns]       // Update column data in table view at runtime
    visibleDataTable: true   // Request the data visible by the user at that time
    dataTable: true          // Request the current data visible or not by the user
    exportExcel: true        // Call export to excel from table
    exportPdf: true          // Call export to pdf from table

-- Use example:

    this.notificationNgxService.raise('Table name', { visibleDataTable: true });


=
      UPDATE AND ADD NEW STYLES


@Component({
    ...,
    encapsulation: ViewEncapsulation.None
})

-- class: .container-powerfull {
    ...,
    ....,
    ..
}
