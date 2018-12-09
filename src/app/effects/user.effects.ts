import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRoot from '../reducers';
import * as actions from '../actions/user.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { User } from '../domain';
import { UserService } from './../services/user.service';

@Injectable()
export class UserEffects {
    @Effect()
    searchUsers$: Observable<Action> = this.actions$.pipe(
        ofType<actions.UserSearchAction>(actions.UserActionTypes.USER_SEARCH),
        map(action => action.payload),
        switchMap((str =>
            this.service$.search(str).pipe(
                map(tasks => new actions.UserSearchSuccessAction(tasks)),
                catchError(err => of(new actions.UserSearchFailAction(JSON.stringify(err))))
            )
        ))
    );

    @Effect()
    getUserByProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.UserProjectLoadAction>(actions.UserActionTypes.USER_PROJECT_LOAD),
        map(action => action.payload),
        switchMap(projectId =>
            this.service$.getUserByProject(projectId).pipe(
                map(users => new actions.UserProjectLoadSuccessAction(users)),
                catchError(err => of(new actions.UserProjectLoadFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    addProjectRef$: Observable<Action> = this.actions$.pipe(
        ofType<actions.UserProjectAddAction>(actions.UserActionTypes.USER_PROJECT_ADD),
        map(action => action.payload),
        switchMap(({ user, projectId }) =>
            this.service$.addProjectRef(user, projectId).pipe(
                map(u => new actions.UserProjectAddSuccessAction(u)),
                catchError(err => of(new actions.UserProjectAddFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    batchUpdateProjectRef$: Observable<Action> = this.actions$.pipe(
        ofType<actions.UserProjectUpdateAction>(actions.UserActionTypes.USER_PROJECT_UPDATE),
        map(action => action.payload),
        switchMap(project =>
            this.service$.batchUpdateProjectRef(project).pipe(
                map(users => new actions.UserProjectUpdateSuccessAction(users)),
                catchError(err => of(new actions.UserProjectUpdateFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    removeProjectRef$: Observable<Action> = this.actions$.pipe(
        ofType<actions.UserProjectDeleteAction>(actions.UserActionTypes.USER_PROJECT_DELETE),
        map(action => action.payload),
        switchMap(({ user, projectId }) =>
            this.service$.removeProjectRef(user, projectId).pipe(
                map(u => new actions.UserProjectDeleteSuccessAction(u)),
                catchError(err => of(new actions.UserProjectDeleteFailAction(JSON.stringify(err))))
            )
        )
    );
    constructor(private actions$: Actions, private store$: Store<fromRoot.State>, private service$: UserService) { }
}