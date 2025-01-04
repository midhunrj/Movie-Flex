// previousPathUtil.js
let previousPath = null;
export const setPreviousPath = (path) => {
    previousPath = path;
};
export const getPreviousPath = () => {
    return previousPath;
};
