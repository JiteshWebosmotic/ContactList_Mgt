import { Action, Selector, State, StateContext, createSelector } from "@ngxs/store";
import { ContactList } from "src/app/models/contact.model";
import { addContact, editContact, loadContact, removeContact } from "../action/contact.action";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Injectable } from "@angular/core";

export class contactStateModel {
    contact: ContactList[] = [];
}

@State<contactStateModel>({
    name: 'contact',
    defaults: {
        contact: []
    }
})

@Injectable()
export class contactState {
    constructor(private localStorageService: LocalStorageService) { }

    @Selector()
    static getContacts(state: contactStateModel) {
        return state.contact;
    }

    // Custom selector
    static getPaginatedItems = createSelector(
        [contactState.getContacts],
        (contactList: ContactList[]) => {
            return (id: string, pageSize: number, start: number, searchTerm?: string) => {
                if (searchTerm) {
                    contactList = contactList.filter((item: ContactList) => item.userId === id && (item.name.includes(searchTerm) || item.email.includes(searchTerm)));
                } else {
                    contactList = contactList.filter((m: ContactList) => m.userId === id);
                }
                //return the data according the page
                let endPage = pageSize * (start ? start : 1);
                let startPage = endPage - pageSize;

                let perPage = Math.ceil(contactList.length / pageSize);
                let paggger = new Array(perPage).fill(1).map((d, i) => ++i);

                return {contact: contactList.slice(startPage, endPage), paggger: paggger};
            }
        }
    );

    @Action(loadContact)
    load({ setState }: StateContext<contactStateModel>, { payload }: loadContact) {
        setState({ contact: payload });
    }
 
    @Action(addContact)
    add({ getState, patchState }: StateContext<contactStateModel>, { payload }: addContact) {
        const state = getState();
        let available = state.contact.find((con: ContactList) => con.email === payload.email)
        if (available) {
            throw new Error('Email id is already in Used.');
        } else {
            patchState({contact: [...state.contact, payload]});
            this.localStorageService.setContactList([...state.contact, payload]);
        }
    }

    @Action(editContact)
    edit({ getState, setState }: StateContext<contactStateModel>, { payload }: editContact) {
        const state = getState();
        const updatedContacts = state.contact.map((contactData) =>
            contactData.id === payload.id ? payload : contactData
        );
        setState({ contact: updatedContacts });
        this.localStorageService.setContactList(updatedContacts);
    }

    @Action(removeContact)
    remove({ getState, setState }: StateContext<contactStateModel>, { id }: removeContact) {
        const state = getState();
        const updatedContacts = state.contact.filter((contactData) => contactData.id !== id);
        setState({ contact: updatedContacts });
        this.localStorageService.setContactList(updatedContacts);
    }
}