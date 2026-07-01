import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  setDoc, 
  addDoc,
  writeBatch, 
  query, 
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp as ClientTimestamp
} from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

import firebaseAppletConfig from '../../firebase-applet-config.json';

// Load config
const firebaseConfig = firebaseAppletConfig;

// Initialize client-side Firebase app if not already initialized
const appName = "admin-fallback";
const app = getApps().find(a => a.name === appName) 
  ? getApp(appName) 
  : initializeApp(firebaseConfig, appName);

const hasDatabaseId = false;

const clientDb = getFirestore(app);

// Helper to convert client DocumentSnapshot to Admin-like DocumentSnapshot
class AdminDocumentSnapshot {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get exists() {
    return this._snap.exists();
  }
  get id() {
    return this._snap.id;
  }
  get ref() {
    const fullPath = this._snap.ref.path;
    const parts = fullPath.split('/');
    const collPath = parts.slice(0, parts.length - 1).join('/');
    return new AdminDocumentReference(collPath, this.id);
  }
  data() {
    return this._snap.data();
  }
}

// Helper to convert client QuerySnapshot to Admin-like QuerySnapshot
class AdminQuerySnapshot {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get size() {
    return this._snap.size;
  }
  get docs() {
    return this._snap.docs.map((docSnap: any) => new AdminDocumentSnapshot(docSnap));
  }
  forEach(callback: (doc: AdminDocumentSnapshot) => void) {
    this.docs.forEach(callback);
  }
}

// Document reference class
class AdminDocumentReference {
  private _path: string;
  private _id: string;
  constructor(collectionPath: string, id: string) {
    this._path = `${collectionPath}/${id}`;
    this._id = id;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  async get() {
    const clientDocRef = doc(clientDb, this._path);
    const snap = await getDoc(clientDocRef);
    return new AdminDocumentSnapshot(snap);
  }
  async update(data: any) {
    const clientDocRef = doc(clientDb, this._path);
    const preparedData = prepareDataForClient(data);
    await updateDoc(clientDocRef, preparedData);
  }
  async set(data: any, options?: { merge?: boolean }) {
    const clientDocRef = doc(clientDb, this._path);
    const preparedData = prepareDataForClient(data);
    await setDoc(clientDocRef, preparedData, { merge: options?.merge ?? false });
  }
}

// Collection reference class
class AdminCollectionReference {
  private _path: string;
  private _limitVal: number | null = null;
  constructor(path: string) {
    this._path = path;
  }
  doc(id?: string) {
    const docId = id || doc(collection(clientDb, this._path)).id;
    return new AdminDocumentReference(this._path, docId);
  }
  limit(n: number) {
    this._limitVal = n;
    return this;
  }
  async get() {
    const clientColRef = collection(clientDb, this._path);
    let q = query(clientColRef);
    if (this._limitVal !== null) {
      q = query(clientColRef, firestoreLimit(this._limitVal));
    }
    const snap = await getDocs(q);
    return new AdminQuerySnapshot(snap);
  }
  async add(data: any) {
    const clientColRef = collection(clientDb, this._path);
    const preparedData = prepareDataForClient(data);
    const docRef = await addDoc(clientColRef, preparedData);
    return new AdminDocumentReference(this._path, docRef.id);
  }
}

// Batch class
class AdminWriteBatch {
  private _batch: any;
  constructor() {
    this._batch = writeBatch(clientDb);
  }
  set(docRef: AdminDocumentReference, data: any, options?: { merge?: boolean }) {
    const clientDocRef = doc(clientDb, docRef.path);
    const preparedData = prepareDataForClient(data);
    this._batch.set(clientDocRef, preparedData, { merge: options?.merge ?? false });
    return this;
  }
  update(docRef: AdminDocumentReference, data: any) {
    const clientDocRef = doc(clientDb, docRef.path);
    const preparedData = prepareDataForClient(data);
    this._batch.update(clientDocRef, preparedData);
    return this;
  }
  delete(docRef: AdminDocumentReference) {
    const clientDocRef = doc(clientDb, docRef.path);
    this._batch.delete(clientDocRef);
    return this;
  }
  async commit() {
    await this._batch.commit();
  }
}

// Helper to convert admin FieldValue / Timestamp or nested data to client-side format
function prepareDataForClient(data: any): any {
  if (data === null || data === undefined) return data;
  if (data instanceof AdminTimestamp) {
    return ClientTimestamp.fromDate(data.toDate());
  }
  if (data instanceof Date) {
    return ClientTimestamp.fromDate(data);
  }
  if (Array.isArray(data)) {
    return data.map(prepareDataForClient);
  }
  if (typeof data === 'object') {
    // If it's a serverTimestamp sentinel placeholder
    if (data._sentinel === 'serverTimestamp') {
      return serverTimestamp();
    }
    const result: any = {};
    for (const key of Object.keys(data)) {
      result[key] = prepareDataForClient(data[key]);
    }
    return result;
  }
  return data;
}

// Mock FieldValue and Timestamp
const FieldValue = {
  serverTimestamp: () => ({ _sentinel: 'serverTimestamp' })
};

class AdminTimestamp {
  private _seconds: number;
  private _nanoseconds: number;
  constructor(seconds: number, nanoseconds: number) {
    this._seconds = seconds;
    this._nanoseconds = nanoseconds;
  }
  static fromDate(date: Date) {
    return new AdminTimestamp(Math.floor(date.getTime() / 1000), (date.getTime() % 1000) * 1e6);
  }
  static now() {
    return AdminTimestamp.fromDate(new Date());
  }
  toDate() {
    return new Date(this._seconds * 1000 + this._nanoseconds / 1e6);
  }
}

// Root DB Mock
const dbMock = {
  collection: (path: string) => new AdminCollectionReference(path),
  batch: () => new AdminWriteBatch()
};

export { dbMock as db };
export { FieldValue };
export { AdminTimestamp as Timestamp };
