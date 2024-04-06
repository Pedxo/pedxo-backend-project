import * as randomString from 'randomstring';

export const token = randomString.generate({
  length: 6,
  charset: 'alphanumeric',
});
