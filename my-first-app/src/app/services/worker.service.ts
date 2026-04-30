import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private firestore = inject(Firestore);

  // Nome della collezione in Firebase
  private collectionName = 'workers';

  /**
   * 1. RECUPERA LA LISTA DI TUTTI I WORKER
   */
  getWorkers(): Observable<any[]> {
    const workersRef = collection(this.firestore, this.collectionName);
    // L'opzione { idField: 'id' } assegna automaticamente l'ID univoco del documento Firebase all'oggetto restituito
    return collectionData(workersRef, { idField: 'id' });
  }

  /**
   * 2. RECUPERA UN SINGOLO WORKER TRAMITE ID
   */
  getWorkerById(workerId: string): Observable<any> {
    const workerDocRef = doc(this.firestore, `${this.collectionName}/${workerId}`);
    return docData(workerDocRef, { idField: 'id' });
  }

  /**
   * 3. AGGIUNGI UN NUOVO WORKER (Es. dalla pagina Settings/Admin)
   */
  addWorker(workerData: any): Observable<any> {
    const workersRef = collection(this.firestore, this.collectionName);

    // Mappatura dei dati in base al tuo schema DB
    const newWorker = {
      name: workerData.name || '',
      email: workerData.email || '',
      role: workerData.role || '',
      working: workerData.status === 'active', // Converte la stringa in booleano
      emergency_contact: workerData.phone || '', // Mappa phone su emergency_contact
      info: workerData.location || '',
      team_id: workerData.team_id || null
    };

    return from(addDoc(workersRef, newWorker));
  }

  /**
   * 4. AGGIORNA UN WORKER ESISTENTE (Es. dal modulo di modifica Team)
   */
  updateWorker(workerId: string, formValues: any): Observable<void> {
    const workerDocRef = doc(this.firestore, `${this.collectionName}/${workerId}`);

    // Costruiamo l'oggetto da aggiornare basandoci sui valori passati dal form
    const dbData: any = {};

    if (formValues.role !== undefined) dbData.role = formValues.role;
    if (formValues.email !== undefined) dbData.email = formValues.email;
    if (formValues.status !== undefined) dbData.working = formValues.status === 'active';
    if (formValues.phone !== undefined) dbData.emergency_contact = formValues.phone;
    if (formValues.location !== undefined) dbData.info = formValues.location;
    if (formValues.team_id !== undefined) dbData.team_id = formValues.team_id;

    return from(updateDoc(workerDocRef, dbData));
  }

  /**
   * 5. ELIMINA UN WORKER
   */
  deleteWorker(workerId: string): Observable<void> {
    const workerDocRef = doc(this.firestore, `${this.collectionName}/${workerId}`);
    return from(deleteDoc(workerDocRef));
  }
}
