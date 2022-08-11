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

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => { setTimeout(resolve, ms); });
