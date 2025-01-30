export const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function createElement(args) {
  const { tag, className, content, rest } = args;
  const element = document.createElement(tag);
  element.textContent = content;

  if (className) {
    className.map((arg) => {
      element.classList.add(arg);
    });
  }

  if (rest) {
    rest.map((arg) => {
      const key = Object.keys(arg);
      const value = Object.values(arg);
      element.setAttribute(`${key}`, `${value}`);
    });
  }
  return element;
}
