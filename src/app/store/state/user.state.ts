import {
    Action,
    Selector,
    State,
    StateContext,
    createSelector,
} from '@ngxs/store';
import { User } from 'src/app/models/contact.model';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

// #### User Actions declaration ####
export class loadUsers {
    static readonly type = '[User] load user';
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

// #### User State Model ####
export class userStateModel {
    user: User[] = [];
}

// #### Contact State ####
@State<userStateModel>({
    name: 'user',
    defaults: {
        user: [],
    },
})
@Injectable()
export class userState {
    constructor(private localStorageService: LocalStorageService) { }

    @Selector() // # Normal/Simple Selector #
    static getUser(state: userStateModel) {
        return state.user;
    }

    // ### Custom selector ###
    static getPaginatedItems = createSelector(
        [userState.getUser],
        (userList: User[]) => {
            return (pageSize: number, start: number, searchTerm?: string) => {
                if (searchTerm) {
                    userList = userList.filter(
                        (item: User) =>
                            item.name?.includes(searchTerm) ||
                            item.email?.includes(searchTerm)
                    );
                }
                //return the data according the page
                let endPage = pageSize * (start ? start : 1);
                let startPage = endPage - pageSize;

                let perPage = Math.ceil(userList.length / pageSize);
                let paggger = new Array(perPage).fill(1).map((d, i) => ++i);

                return {
                    userList: userList.slice(startPage, endPage),
                    paggger: paggger,
                };
            };
        }
    );

    // #### Action Execution ####
    @Action(loadUsers)
    load({ setState }: StateContext<userStateModel>, { payload }: loadUsers) {
        setState({ user: payload });
    }

    @Action(addUser)
    add(
        { getState, patchState }: StateContext<userStateModel>,
        { payload }: addUser
    ) {
        const state = getState();
        let available = state.user.find((u: User) => u.email === payload.email);
        if (available) {
            throw new Error('Email id is already in Used.');
        } else {
            patchState({ user: [...state.user, payload] });
            this.localStorageService.setUserList([...state.user, payload]);
        }
    }

    @Action(editUser)
    edit(
        { getState, setState }: StateContext<userStateModel>,
        { payload }: editUser
    ) {
        const state = getState();
        let available = state.user.find(
            (u: User) => u.email === payload.email && u.id != payload.id
        );
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
