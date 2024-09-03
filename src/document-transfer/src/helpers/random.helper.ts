import crypto from 'node:crypto';
import { Alphanumeric } from './string.const';

type NumberGenerator = (max: number) => number;

const classicNumberGenerator = (max: number) => Math.floor(Math.random() * max);
const secureNumberGenerator = (max: number) => crypto.randomInt(max);

const getRandomString = (
  length: number,
  alphabet = Alphanumeric,
  generator: NumberGenerator = classicNumberGenerator,
) =>
  Array.from({ length })
    .map(() => generator(alphabet.length))
    .map((index) => alphabet[index])
    .join('');

const getSecureRandomString = (length: number, alphabet = Alphanumeric) =>
  getRandomString(length, alphabet, secureNumberGenerator);

export { getRandomString, getSecureRandomString };
