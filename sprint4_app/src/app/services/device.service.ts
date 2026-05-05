import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  query
} from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs'; // from makes Observable from Promise
import { LocalizationDevice } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private firestore = inject(Firestore);

  private collectionName = 'localization_devices';

  getDevices(): Observable<LocalizationDevice[]> {
    const ref = collection(this.firestore, this.collectionName);

    return collectionData(ref, { idField: 'id' }) as Observable<LocalizationDevice[]>;
  }

  getDeviceById(id: string): Observable<LocalizationDevice> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);

    return docData(ref, { idField: 'id' }) as Observable<LocalizationDevice>;
  }

  getDeviceByWorkerId(workerId: string): Observable<LocalizationDevice | undefined> {
    return this.getDevices().pipe(
      map((devices: LocalizationDevice[]) =>
        devices.find(d => d.assignedWorkerId === workerId)
      )
    );
  }

  getFreeDevices(): Observable<LocalizationDevice[]> {
    const ref = collection(this.firestore, this.collectionName);

    const q = query(ref, where('assignedWorkerId', '==', null));

    return collectionData(q, { idField: 'id' }) as Observable<LocalizationDevice[]>;
  }

  getAssignableDevicesForWorker(workerId?: string): Observable<LocalizationDevice[]> {
    return this.getDevices().pipe(
      map(devices =>
        devices.filter(d =>
          !d.assignedWorkerId ||
          d.assignedWorkerId === workerId
        )
      )
    );
  }

  addDevice(device: LocalizationDevice) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, device);
  }

  /**
   * Update device position (important for tracking)
   */
  updateDevice(id: string, data: Partial<LocalizationDevice>) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(ref, data);
  }

  deleteDevice(id: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(ref);
  }

  assignToWorker(deviceId: string, workerId: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${deviceId}`);

    return updateDoc(ref, {
      assignedWorkerId: workerId
    });
  }

  unassign(deviceId: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${deviceId}`);

    return updateDoc(ref, {
      assignedWorkerId: null
    });
  }

}
