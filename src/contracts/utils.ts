export const stringToHex = (value: string): string => {
  let result = "";

  for (let i = 0; i < value.length; i++) {
    result += value.charCodeAt(i).toString(16).slice(-4);
  }

  return result;
};