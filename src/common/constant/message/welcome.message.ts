export const welcomeMessage = async (email: string, code: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #cca300; font-weight: bold; font-size: 24px; margin-bottom: 20px;">Congratulations, ${email}!</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">You are one step closer to becoming one of the builders who receive our building support!</p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Use the code below to verify your email address:
      </p>
      <div style="font-size: 18px; font-weight: bold; color: #333; background-color: #f8f8f8; padding: 10px; text-align: center; margin-top: 20px;">
        ${code}
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;">
        <strong>Note:</strong> If you did not request this sign-up, you can safely ignore this email.
      </p>
    </div>
  `;
};
