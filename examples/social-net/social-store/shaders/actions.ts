import { DeepReadonly } from 'partially-shared-store/definitions';
import { Action, ActionTypes, UpdateUserAction } from '../actions';
import { UserModel } from '../models';
import { SocialState } from '../state';
import { shadowUserModel } from './models';

export const shadowAction = <A extends Action | DeepReadonly<Action>>(
  action: A,
  to: DeepReadonly<UserModel>,
  state: DeepReadonly<SocialState>,
): A => {
  if (action.type == ActionTypes.UpdateUser) {
    return {
      ...action,
      user: shadowUserModel((action as UpdateUserAction).user, to, state),
    };
  }
  return action;
};
