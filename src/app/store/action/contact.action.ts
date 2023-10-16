import { ContactList } from "src/app/models/contact.model";

export class getContact {
    static readonly type = '[Contact] get contact';
    constructor(public payload: ContactList[]) { }
}

export class addContact {
    static readonly type = '[Contact] add contact';
    constructor(public payload: ContactList) { }
}

export class editContact {
    static readonly type = '[Contact] edit contact';
    constructor(public payload: ContactList) { }
}

export class removeContact {
    static readonly type = '[Contact] remove contact';
    constructor(public id: string) { }
}

