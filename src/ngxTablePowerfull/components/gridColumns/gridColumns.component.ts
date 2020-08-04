import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'grid-columns-component',
    templateUrl: './gridColumns.component.html',
    styleUrls: ['./gridColumns.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class GridColumnsComponent {
    public columns: any[] = [];
    public description: string = '';

    constructor(private dialogRef: MatDialogRef<GridColumnsComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.columns = data.columns.map(d => Object.assign({}, d));
    }

    ngOnInit(): void { 
    }

    public save() {
        this.dialogRef.close(this.columns);
    }

    public close() {
        this.dialogRef.close();
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }
}
