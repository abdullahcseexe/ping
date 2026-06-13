import * as SecureStore from "expo-secure-store";

const keyFor = (chatId: string) => `deleted-for-me:${chatId}`;

export async function getDeletedForMeIds(chatId: string): Promise<Set<string>> {
  try {
    const raw = await SecureStore.getItemAsync(keyFor(chatId));
    if (!raw) return new Set();
    const ids: string[] = JSON.parse(raw);
    return new Set(ids);
  } catch {
    return new Set();
  }
}

export async function addDeletedForMeId(chatId: string, messageId: string): Promise<void> {
  try {
    const ids = await getDeletedForMeIds(chatId);
    ids.add(messageId);
    await SecureStore.setItemAsync(keyFor(chatId), JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage errors
  }
}