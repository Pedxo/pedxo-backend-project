export const ResponseMessage = {
  toOwnerOutSourceTemplate: async (
    name: string,
    team: any,
    projectName: string,
    email: string,
    phoneNumber: string,
    description: string,
  ) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">${name} just sent a project for outsourcing. Below are the details:</p>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>Project Name:</strong> ${projectName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Contact Phone Number:</strong> ${phoneNumber}</li>
        <li><strong>Project Description:</strong> ${description}</li>
        <li><strong>Team Needed for the Project:</strong> ${team}</li>
      </ul>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Please reach out to ${name} as soon as possible.</p>
    </div>
  `;
  },
  outSourceSubject: `Project OutSource`,

  responseToOutSource: async () => {
    return `project received successfully one of us will reach out to you soon `;
  },

  toOwnerDemoTemplate: (name: string, date: string, companyName: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">${name} from ${companyName} has sent you an email to book a demo. Please find the scheduled date and time below:</p>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime}</li>
      </ul>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Kindly contact them for further arrangements.</p>
    </div>
  `;
  },

  demoSubject: `Demo booked`,

  responseToBooker: async (data: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Your meeting has been confirmed for ${data} with Pedxo.</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Make sure to update your calendar to be available for the meeting.</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Please note that 30 minutes before the scheduled time, our team will contact you to remind you.</p>
    </div>
  `;
  },
};
