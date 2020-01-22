import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

let whitelist = ['auth'];

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: whitelist,
    stateReconciler: autoMergeLevel2,
};

let middleware = [
    thunk,
];

if (__DEV__) {
    // Dev-only middleware
    middleware = [
        ...middleware,
        createLogger(), // Logs state changes to the dev console
    ];
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = compose(
    applyMiddleware(...middleware),
)(createStore)(persistedReducer);

persistStore(store);

export default store;
