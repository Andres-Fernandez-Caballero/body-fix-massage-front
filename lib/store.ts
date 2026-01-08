import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";

async function secureSafe(key: string, value: string) { 
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}

async function secureGet(key: string) { 
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
}

async function secureDelete(key: string) { 
    console.log("plataforma", Platform.OS)
    if (Platform.OS === 'web') {
        console.log("eliminando key", key);
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
}

export { secureSafe, secureGet, secureDelete };
