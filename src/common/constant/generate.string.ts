import * as randomString from 'randomstring';

export const token = randomString.generate({
  length: 15,
  charset: 'alphanumeric',
});
