import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ContactList } from "src/app/models/contact.model";
import { addContact, editContact, getContact, removeContact } from "../action/contact.action";

export class contactStateModel {
    contact: ContactList[] = [];
}

@State<contactStateModel>({
    name: 'contact',
    defaults: {
        contact: []
    }
})

export class contactState {
    @Selector()
    static getContacts(state: contactStateModel) {
        return state.contact;
    }

    @Action(getContact)
    get({ setState }: StateContext<contactStateModel>, { payload }: getContact) {
        setState({ contact: payload });
    }

    @Action(addContact)
    add({ getState, patchState }: StateContext<contactStateModel>, { payload }: addContact) {
        const state = getState();
        patchState({
            contact: [...state.contact, payload]
        })
    }

    @Action(editContact)
    edit({ getState, setState }: StateContext<contactStateModel>, { payload }: editContact) {
        const state = getState();
        const updatedContacts = state.contact.map((contactData) =>
            contactData.id === payload.id ? payload : contactData
        );
        setState({ contact: updatedContacts });
    }

    @Action(removeContact)
    remove({ getState, setState }: StateContext<contactStateModel>, { id }: removeContact) {
        const state = getState();
        const updatedContacts = state.contact.filter((contactData) => contactData.id !== id);
        setState({ contact: updatedContacts });
    }
}
