import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userStore';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

const combinedReducer = combineReducers({
    user: userReducer,
})
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}
const store = configureStore({
    reducer: persistReducer(persistConfig, combinedReducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})
})

export default store;
export const persistor = persistStore(store);