export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
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