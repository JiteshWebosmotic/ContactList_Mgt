import { Action, Selector, State, StateContext } from "@ngxs/store";
import { User } from "src/app/models/contact.model";
import { addUser, editUser, getUsers } from "../action/user.action";

export class userStateModel {
    user: User[] = [];
}

@State<userStateModel>({
    name: 'user',
    defaults: {
        user: []
    }
})

export class userState {
    @Selector()
    static getUser(state: userStateModel) {
        return state.user;
    }

    @Action(getUsers)
    get({ setState }: StateContext<userStateModel>, { payload }: getUsers) {
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
