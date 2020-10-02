export const sampleTableColumns = [
    {
        prop: 'id',
        index: true,
        hide: true
      },
      {
        prop: 'name',
        name: 'Name',
        //flexGrow: 4,
        field: {
          type: 'select',
          method: 'getOptionsName'
        }
      },
      {
        prop: 'weight',
        name: 'Weight',
        editable: true,
        field: {
          type: 'number',
          size: 6
        },
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
        prop: 'birthdate',
        name: 'Birthdate',
        formatDate: 'dd/MM/yyyy',
        field: {
          type: 'date',
          size: 6
        }
      },
      {
        prop: 'delete',
        name: '',
        action: 'delete',
        predefinedData: 'delete',
        tooltip: true,
        tooltipText: 'Eliminar',
        tag: 'i',
        attributes: [ 
            {
              name: 'class',
              value: 'material-icons delete-icon'
            }
        ]
      } 
];