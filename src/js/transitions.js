export function fadeIn(element) {
  return new Promise((resolve) => {
    if (element.style.display !== "none") {
      resolve();
      return;
    }

    element.style.display = null;
    element.style.opacity = 0;
    element.classList.add("fade");

    setTimeout(() => {
      element.style.opacity = 1;
      element.addEventListener("transitionend", function _f() {
        element.removeEventListener("transitionend", _f);
        element.classList.remove("fade");
        resolve();
      });
    });
  });
}

export function fadeOut(element) {
  return new Promise((resolve) => {
    if (element.style.display === "none") {
      resolve();
      return;
    }

    element.style.opacity = 1;
    element.classList.add("fade");

    setTimeout(() => {
      element.style.opacity = 0;
      element.addEventListener("transitionend", function _f() {
        element.removeEventListener("transitionend", _f);
        element.style.display = "none";
        element.classList.remove("fade");
        resolve();
      });
    });
  });
}
