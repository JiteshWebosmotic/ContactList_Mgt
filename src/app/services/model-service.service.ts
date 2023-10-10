import { Injectable } from '@angular/core';
export interface User {
  id: string,
  name: string,
  email: string,
  password: string
}
export interface ContactList {
  userId: string,
  id: string,
  name: string,
  email: string,
  number: number,
  image: string
}
export interface ContactData {
  user: User[],
  contactList: ContactList[]
}

@Injectable({
  providedIn: 'root'
})
export class ModelServiceService {

  constructor() { }
}
