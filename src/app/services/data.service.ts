import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public flattenObject(data): any {
    return data.map((value, key) => this.flattenOneObject(value));
  }

  public flattenOneObject(ob): any {
    if (typeof ob === 'string') {
      return ob;
    }
    const toReturn = {};
    for (const i in ob) {
      if (!ob.hasOwnProperty(i)) { continue; }
      // tslint:disable-next-line: triple-equals
      if ((typeof ob[i]) == 'object' && !(ob[i] instanceof Array)) {
        const flatObject = this.flattenOneObject(ob[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) { continue; }
          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  public deflattenObject(obj: any): any {
    const type = typeof obj;
    const result = {};
    if (type == 'object' && !(obj instanceof Array)) {
      // tslint:disable-next-line: forin
      for (const i in obj) {
        const allKeys = i.split('.');
        // tslint:disable-next-line: prefer-const
        // tslint:disable-next-line: one-variable-per-declaration
        let temp = result, length = allKeys.length;
        const lastKey = allKeys[length - 1];
        allKeys.forEach((key, i) => {
          if (i < (length - 1)) {
            temp[key] = temp[key] || {};
            temp = temp[key];
          }
        });
        temp[lastKey] = obj[i];
      }
      return result;
    } else {
      return obj;
    }
  }
}
