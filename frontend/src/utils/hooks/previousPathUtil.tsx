// previousPathUtil.js
let previousPath:string|null = null;

export const setPreviousPath = (path:string|null) => {
  previousPath = path;
};

export const getPreviousPath = () => {
  return previousPath;
};
