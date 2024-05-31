export const generateOTPString = (): string => {
  // Define the length of the OTP
  const otpLength = 30;
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Generate a random OTP string of the specified length
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};
