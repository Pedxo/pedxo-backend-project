// import * as randomString from 'randomstring';

// export const token = randomString.generate({
//   length: 30,
//   charset: 'alphanumeric',
// });

export const generateOtpCode = {
  generateString: (length: number) => {
    return Math.round(Math.random() * length).toString();
  },
};
