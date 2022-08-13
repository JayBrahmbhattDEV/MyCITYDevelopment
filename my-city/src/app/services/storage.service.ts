import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {
    storage.create();
  }
  setData(key: string, data: any) {
    return this.storage.set(key, data);
  }
  getData(key: string) {
    return this.storage.get(key);
  }
}
