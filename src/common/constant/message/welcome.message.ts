export const welcomeMessage = async (username: string, code: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #cca300; font-weight: bold; font-size: 24px; margin-bottom: 20px;">Congratulations, ${username}!</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">You are one step closer to becoming one of the builders who receive our building support!</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Click the button below to verify your email address:</p>
      <div style="margin-top: 20px;">
        <a href="https://pedxo.netlify.app/verifying-user-email/?code=${code}" style="display: inline-block; background-color: #ffcc00; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Verify Email</a>
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;"><strong>Note:</strong> If you did not request this sign-up, you can safely ignore this email.</p>
    </div>
  `;
};
