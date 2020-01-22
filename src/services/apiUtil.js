/* globals XMLHttpRequest, fetch */
/* eslint-disable no-console */
import { Toast } from 'native-base';
import qs from 'qs';
import store from '../utils/store';
import NavigationService from './navigation';
import { objectToFormData } from '../utils/rest';

export default class ApiUtil {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    static log(url, msg) {
        console.warn(`Error in request to url ${url}`);
        console.warn(msg);
    }

    get = async (url, opts = {}) => {
        let { headers = {}, query, showError = true, redirectToLogin = true } = opts;
        let { auth: { token } } = store.getState();
        if (token) {
            headers.Authorization = headers.Authorization || 'Bearer ' + token;
        }

        url = `${this.baseUrl}${url}`;
        if(query) {
            url+=`?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
        }

        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(url, {
                    headers
                });
                if (response.ok) {
                    resolve(response);
                } else {
                    ApiUtil.log(response.url, response);
                    redirectToLogin && response.status === 401 && NavigationService.navigate('Login');
                    if (showError) {
                        let { message } = await response.json();
                        message && Toast.show({ text: message });
                    }
                    reject(response.statusText);
                }
            } catch (err) {
                ApiUtil.log(url, err);
                reject(err);
            }
        });
    }

    post = async (url, opts = {}) => {
        let { headers = {}, body, showError = true, redirectToLogin = true } = opts;
        let { auth: { token } } = store.getState();
        if (token) {
            headers.Authorization = headers.Authorization || 'Bearer ' + token;
        }
        url = `${this.baseUrl}${url}`;
        let options = {
            headers: {
                ...headers,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(body)
        };

        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(url, options);
                if (response.ok) {
                    resolve(response);
                } else {
                    ApiUtil.log(url, response);
                    redirectToLogin && response.status === 401 && NavigationService.navigate('Login');
                    if (showError) {
                        let { message } = await response.json();
                        message && Toast.show({ text: message });
                    }
                    reject(response.statusText);
                }
            } catch (err) {
                ApiUtil.log(url, err);
                reject(err);
            }
        });
    }

    fetch = async (url, opts = {}) => {
        let { headers = {}, query, body, method,  showError = true, redirectToLogin = true } = opts;
        let { auth: { token } } = store.getState();
        if (token) {
            headers.Authorization = headers.Authorization || 'Bearer ' + token;
        }
        url = `${this.baseUrl}${url}`;
        if(query) {
            url+=`?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
        }
        let options = {
            headers: {
                ...headers,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            body: JSON.stringify(body)
        };

        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(url, options);
                if (response.ok) {
                    resolve(response);
                } else {
                    ApiUtil.log(url, response);
                    redirectToLogin && response.status === 401 && NavigationService.navigate('Login');
                    if (showError) {
                        let { message } = await response.json();
                        message && Toast.show({ text: message });
                    }
                    reject(response.statusText);
                }
            } catch (err) {
                ApiUtil.log(url, err);
                reject(err);
            }
        });
    }

    futch = async (url, opts = {}, onProgress) => {
        let { auth: { token } } = store.getState();
        let { headers = {}, query, body, method,  showError = true } = opts;
        url = `${this.baseUrl}${url}`;
        if(query) {
            url+=`?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
        }
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method || 'get', url);
            for (let k in headers || {})
                xhr.setRequestHeader(k, headers[k]);

            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === xhr.DONE) {

                    if (xhr.status >= 200 && xhr.status <300) {
                        res(xhr.response);
                    } else {
                        const message = xhr.response;
                        ApiUtil.log(url, message);
                        showError && message && Toast.show({ text: message });
                        rej(message);
                    }
                }
            };
            if (xhr.upload && onProgress)
                xhr.upload.onprogress = (progressEvent) => {
                    const progress = progressEvent.loaded / progressEvent.total;
                    onProgress(progress);
                }; // event.loaded / event.total * 100 ; //event.lengthComputable
            xhr.send(objectToFormData(body, {
                hideProperty: true,
                hideIndex: true
            }));
        });
    }
}
