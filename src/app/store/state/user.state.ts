import { Action, Selector, State, StateContext } from "@ngxs/store";
import { User } from "src/app/models/contact.model";
import { addUser, editUser, loadUsers } from "../action/user.action";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "src/app/services/local-storage.service";

export class userStateModel {
    user: User[] = [];
}

@State<userStateModel>({
    name: 'user',
    defaults: {
        user: []
    }
})

@Injectable()
export class userState {
    constructor(private localStorageService: LocalStorageService,) { }

    @Selector()
    static getUser(state: userStateModel) {
        return state.user;
    }

    @Action(loadUsers)
    load({ setState }: StateContext<userStateModel>, { payload }: loadUsers) {
        setState({ user: payload });
    }

    @Action(addUser)
    add({ getState, patchState }: StateContext<userStateModel>, { payload }: addUser) {
        const state = getState();
        let available = state.user.find((u: User) => u.email === payload.email)
        if (available) {
            throw new Error('Email id is already in Used.');
        } else {
            patchState({ user: [...state.user, payload] });
            this.localStorageService.setUserList([...state.user, payload]);
        }
    }

    @Action(editUser)
    edit({ getState, setState }: StateContext<userStateModel>, { payload }: editUser) {
        const state = getState();
        let available = state.user.find((u: User) => (u.email === payload.email && u.id != payload.id))
        if (available) {
            throw new Error('Email id is already in Used.');
        } else {
            const updatedUsers = state.user.map((userData) =>
            userData.id === payload.id ? payload : userData
            );
            setState({ user: updatedUsers });
            this.localStorageService.setUserList(updatedUsers);
        }
    }
}
