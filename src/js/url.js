export function loadInputFromUrl() {
  const hash = window.location.hash;

  if (!hash) return "";

  try {
    return atob(hash.slice(1));
  } catch (err) {
    return "";
  }
}

export function saveInputToUrl(input) {
  const hash = input ? btoa(input) : "";
  history.replaceState(null, null, "#" + hash);
}
