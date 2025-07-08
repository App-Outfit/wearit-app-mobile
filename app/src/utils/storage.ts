import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// --- Body (JSON) ---
const BODY_KEY = 'bodyData';

export async function saveBody(body: any) {
  await AsyncStorage.setItem(BODY_KEY, JSON.stringify(body));
}

export async function loadBody() {
  const data = await AsyncStorage.getItem(BODY_KEY);
  return data ? JSON.parse(data) : null;
}

export async function deleteBody() {
  await AsyncStorage.removeItem(BODY_KEY);
}

// --- Mask (image PNG/base64) ---
const MASK_FILENAME = 'body_mask.png';
const MASK_PATH = FileSystem.documentDirectory + MASK_FILENAME;

// maskData doit être un string base64 (sans header data:image/png;base64,)
export async function saveMask(maskBase64: string) {
  await FileSystem.writeAsStringAsync(MASK_PATH, maskBase64, { encoding: FileSystem.EncodingType.Base64 });
}

export async function loadMaskUri() {
  const info = await FileSystem.getInfoAsync(MASK_PATH);
  return info.exists ? MASK_PATH : null;
}

export async function deleteMask() {
  const info = await FileSystem.getInfoAsync(MASK_PATH);
  if (info.exists) {
    await FileSystem.deleteAsync(MASK_PATH);
  }
} 