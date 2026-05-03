import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, CollectionReference, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs'; // from makes Observable from Promise

import { Worker } from '../models/worker.model'

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private firestore = inject(Firestore);

  private collectionName = 'workers'; // Firestore collection name

  getWorkers(): Observable<Worker[]> {
    const workersRef = collection(this.firestore, this.collectionName);
    return collectionData(workersRef, { idField: 'id' }) as Observable<Worker[]>;
  }

  getWorkerById(workerId: string): Observable<Worker> {
    const workerDocRef = doc(this.firestore, `${this.collectionName}/${workerId}`);
    return docData(workerDocRef, { idField: 'id' }) as Observable<Worker>;
  }

  getWorkersByTeam(teamId: string): Observable<Worker[]> {
    const ref = collection(this.firestore, 'workers') as CollectionReference<Worker>;

    return collectionData(ref, { idField: 'id' }).pipe(
      map((workers: Worker[]) =>
        workers.filter(w => w.teamId === teamId)
      )
    );
  }

  getWorkersByManager(managerId: string): Observable<Worker[]> {
    const ref = collection(this.firestore, 'workers') as CollectionReference<Worker>;

    const q = query(ref, where('managerId', '==', managerId));

    return collectionData(q, { idField: 'id' });
  }

  getActiveWorkers(): Observable<Worker[]> {
    const ref = collection(this.firestore, 'workers') as CollectionReference<Worker>;

    return collectionData(ref, { idField: 'id' }).pipe(
      map((workers: Worker[]) =>
        workers.filter(w => w.active)
      )
    );
  }

  addWorker(worker: Worker) {
    const workersRef = collection(this.firestore, this.collectionName);

    const newWorker: Worker = {
      name: worker.name || '',
      role: worker.role || '',
      email: worker.email || '',
      phone: worker.phone || '',
      photo: worker.photo || '',
      info: worker.info || '',
      emContact: worker.emContact || '',

      active: worker.active ?? false,
      statusOk: worker.statusOk ?? true,

      teamId: worker.teamId || ''
    };

    return addDoc(workersRef, newWorker);
  }

  updateWorker(workerId: string, workerData: Partial<Worker>) {
    const workerDocRef = doc(
      this.firestore,
      `${this.collectionName}/${workerId}`
    );

    return from(updateDoc(workerDocRef, workerData));
  }

  deleteWorker(workerId: string) {
    const workerDocRef = doc(this.firestore, `${this.collectionName}/${workerId}`);
    return deleteDoc(workerDocRef);
  }
}
