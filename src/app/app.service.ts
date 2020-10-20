import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  constructor() { }

  public getNames(): any[] {
    return ['Archer','Sam', { value: '1', text: 'Astrid'} ];
  }


}

