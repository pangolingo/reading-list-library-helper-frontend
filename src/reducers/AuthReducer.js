import { AUTH_TOKEN_RECEIVED, AUTH_FAILED, LOG_OUT } from '../actions';

export default function AuthReducer(state = {}, action) {
  switch (action.type) {
    case AUTH_TOKEN_RECEIVED:
      return {
        ...state,
        authenticated: true,
        jwt: action.jwt
      };
    case AUTH_FAILED:
    case LOG_OUT:
      return {
        ...state,
        authenticated: false,
        jwt: null
      };
    default:
      return state;
  }
}
