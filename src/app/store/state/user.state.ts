import { Action, Selector, State, StateContext } from "@ngxs/store";
import { User } from "src/app/models/contact.model";
import { addUser, editUser, loadUsers } from "../action/user.action";
import { Injectable } from "@angular/core";

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
    constructor(){}

    @Selector()
    static getUser(state: userStateModel) {
        return state.user;
    }

    @Action(loadUsers)
    get({ setState }: StateContext<userStateModel>, { payload }: loadUsers) {
        setState({ user: payload });
    }

    @Action(addUser)
    add({ getState, patchState }: StateContext<userStateModel>, { payload }: addUser) {
        const state = getState();
        patchState({
            user: [...state.user, payload]
        })
    }

    @Action(editUser)
    edit({ getState, setState }: StateContext<userStateModel>, { payload }: editUser) {
        const state = getState();
        const updatedUsers = state.user.map((userData) =>
            userData.id === payload.id ? payload : userData
        );
        setState({ user: updatedUsers });
    }
}
