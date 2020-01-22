export const SET_USER='SET_USER';
export const LOGIN='LOGIN';
export const LOGIN_CRED='LOGIN_CRED';
export const LOGOUT='LOGOUT';
export const SET_TOKEN='SET_TOKEN';

export function hasLoggedin() {
    return { type: LOGIN };
}

export function setUser(user) {
    return { type: SET_USER, user };
}

export function setToken(token) {
    return { type: SET_TOKEN, token };
}

export function setLoginCred(cred) {
    return { type: LOGIN_CRED, cred };
}

export function logout() {
    return { type: LOGOUT };
}
