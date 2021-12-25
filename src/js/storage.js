const storageKey = "input";

export function loadInputFromStorage() {
  try {
    return sessionStorage.getItem(storageKey) || "";
  } catch (err) {
    return "";
  }
}

export function saveInputToStorage(input) {
  try {
    sessionStorage.setItem(storageKey, input);
  } catch (err) {}
}
