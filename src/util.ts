/* eslint-disable import/prefer-default-export */
export const convertNumber = (str: string): number => {
  const expanded = str.replace(/,/g, '');

  if (expanded.endsWith('K')) {
    return +expanded.slice(0, -1) * 1000;
  }

  if (expanded.endsWith('M')) {
    return +expanded.slice(0, -1) * 1000000;
  }

  return +expanded;
};
