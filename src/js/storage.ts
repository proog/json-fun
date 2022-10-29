const storageKey = "input";

export function loadInputFromStorage() {
  try {
    return sessionStorage.getItem(storageKey) || "";
  } catch (err) {
    return "";
  }
}

export function saveInputToStorage(input: string) {
  try {
    sessionStorage.setItem(storageKey, input);
  } catch (err) {}
}
