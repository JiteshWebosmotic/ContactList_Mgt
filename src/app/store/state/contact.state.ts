import {
    Action,
    Selector,
    State,
    StateContext,
    createSelector,
} from '@ngxs/store';
import { ContactList } from 'src/app/models/contact.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Injectable } from '@angular/core';

// #### Contact Actions declaration ####
export class loadContact {
    static readonly type = '[Contact] Load contact';
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

// #### Contact State Model ####
export class contactStateModel {
    contact: ContactList[] = [];
}

// #### Contact State ####
@State<contactStateModel>({
    name: 'contact',
    defaults: {
        contact: [],
    },
})
// #### Contact State class ####
@Injectable()
export class contactState {
    constructor(private localStorageService: LocalStorageService) { }

    @Selector() // # Normal/Simple Selector #
    static getContacts(state: contactStateModel) {
        return state.contact;
    }

    // # Custom selector #
    static getPaginatedItems = createSelector(
        [contactState.getContacts],
        (contactList: ContactList[]) => {
            return (
                id: string,
                pageSize: number,
                start: number,
                searchTerm?: string
            ) => {
                contactList = contactList.filter((item: ContactList) => {
                    if (item.userId === id) {
                        if (searchTerm) {
                            return (
                                item.name.includes(searchTerm) ||
                                item.email.includes(searchTerm)
                            );
                        }
                        return true;
                    }
                    return false;
                });

                let endPage = pageSize * (start ? start : 1);
                let startPage = endPage - pageSize;

                let perPage = Math.ceil(contactList.length / pageSize);
                let paggger = new Array(perPage).fill(1).map((d, i) => ++i);

                return {
                    contact: contactList.slice(startPage, endPage),
                    paggger: paggger,
                };
            };
        }
    );

    // #### Action Execution ####
    @Action(loadContact) 
    load(
        { setState }: StateContext<contactStateModel>,
        { payload }: loadContact
    ) {
        setState({ contact: payload });
    }

    @Action(addContact)
    add(
        { getState, patchState }: StateContext<contactStateModel>,
        { payload }: addContact
    ) {
        const state = getState();
        let available = state.contact.find(
            (con: ContactList) => con.email === payload.email
        );
        if (available) {
            throw new Error('Email id is already in Used.');
        } else {
            patchState({ contact: [...state.contact, payload] });
            this.localStorageService.setContactList([...state.contact, payload]);
        }
    }

    @Action(editContact)
    edit(
        { getState, setState}: StateContext<contactStateModel>,
        { payload }: editContact
    ) {
        const state = getState();

        // Data is updating but not showing updated value on feed.
        // let index = state.contact.findIndex((contactData) =>
        //     contactData.id === payload.id
        // );
        // if(index >=0 && index < state.contact.length){
        //     state.contact[index] = payload;
        // }
        let updatedContects = state.contact.map((contactData)=> contactData.id === payload.id ? payload : contactData)
        setState({ contact: updatedContects });
        this.localStorageService.setContactList(updatedContects);
    }

    @Action(removeContact)
    remove(
        { getState, setState }: StateContext<contactStateModel>,
        { id }: removeContact
    ) {
        const state = getState();
        const updatedContacts = state.contact.filter(
            (contactData) => contactData.id !== id
        );
        setState({ contact: updatedContacts });
        this.localStorageService.setContactList(updatedContacts);
    }
}
