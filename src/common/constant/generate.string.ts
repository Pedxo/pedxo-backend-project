import * as randomString from 'randomstring';

export const token = randomString.generate({
  length: 30,
  charset: 'alphanumeric',
});
