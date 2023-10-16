import { User } from "src/app/models/contact.model";

export class getUsers {
    static readonly type = '[User] get user';
    constructor(public payload: User[]) { }
}

export class addUser {
    static readonly type = '[User] add user';
    constructor(public payload: User) { }
}

export class editUser {
    static readonly type = '[User] edit user';
    constructor(public payload: User) { }
}