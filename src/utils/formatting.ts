import { isString } from '../utils';

const format = (value: string | number): number => {
  return isString(value) ? parseFloat(value) : value;
};

export const parseFixedFloat = (value: string | number, fractionDigits = 2): number => {
  const formattedValue = format(value);
  return parseFloat(formattedValue.toFixed(fractionDigits));
};

export const percentageToPx = (value: number | string, itemSize: number): number => {
  const formattedValue = format(value);
  return parseFixedFloat((formattedValue * itemSize) / 100);
};

export const pxToPercentage = (value: number | string, itemSize: number): number => {
  const formattedValue = format(value);
  return parseFixedFloat((formattedValue * 100) / itemSize);
};
