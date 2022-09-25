import { convertNumber } from '../../util';

describe('unit conversions', () => {
  it('converts 10K', () => {
    expect(convertNumber('10K')).toBe(10000);
  });

  it('converts 10M', () => {
    expect(convertNumber('10M')).toBe(10000000);
  });

  it('converts 109,327', () => {
    expect(convertNumber('109,327')).toBe(109327);
  });

  it('converts 4.1K', () => {
    expect(convertNumber('4.1K')).toBe(4100);
  });
});
