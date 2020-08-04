export const sampleTableColumns = [
    {
        prop: 'id',
        index: true,
        hide: true
      },
      {
        prop: 'name',
        name: 'Name',
        //flexGrow: 4
      },
      {
        prop: 'weight',
        name: 'Weight',
        editable: true,
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
        formatDate: 'dd/MM/yyyy'
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