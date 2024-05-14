import { NeededTeamEnum } from 'src/outsource/enum/outsource.enum';

export const ResponseMessage = {
  toOwnerOutSourceTemplate: async (
    name: string,
    teamNeeded: any,
    projectName: string,
    email: string,
    phoneNumber: string,
    description: string,
    employeeCount: string,
    howDoYouKnowUs: string,
  ) => {
    const teamList = teamNeeded.join(', ');
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">${name} just sent a project for outsourcing. Below are the details:</p>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>Job title:</strong> ${projectName}</li>
        <li><strong>number of employee countdown:</strong> ${employeeCount}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Contact Phone Number:</strong> ${phoneNumber}</li>
        <li><strong>How did him get to know about pedxo is through :</strong> ${howDoYouKnowUs}</li>
        <li><strong>Project Description:</strong> ${description}</li>
        <li><strong>Team Needed for the Project:</strong> ${teamList} </li>
      </ul>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Please reach out to ${name} as soon as possible.</p>
    </div>
  `;
  },
  outSourceSubject: `Project OutSource`,

  responseToOutSource: async () => {
    return `project received successfully one of us will reach out to you soon. Thank you. Pedxo Team `;
  },

  toOwnerDemoTemplate: (
    name: string,
    date: string,
    companyName: string,
    phoneNumber: string,
    howDoYouKnowUs: string,
    numberOfEmployees: string,
    email: string,
    job_title: string,
  ) => {
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
      <p style="font-size: 16px; line-height: 1.5; color: #333;">${name} from ${companyName} company  with the <strong> job title</strong> ${job_title} has sent you an email to book a demo. Please find the scheduled date and time below:</p>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>email address:</strong> ${email}</li>
        <li><strong>number of employees:</strong> ${numberOfEmployees}</li>
        <li><strong>phone number to reach out to:</strong> ${phoneNumber}</li>
        <li><strong>How did him get to know about pedxo is through :</strong> ${howDoYouKnowUs}</li>
        <li><strong>Meeting Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime}</li>
      </ul>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Kindly contact them for further arrangements.</p>
    </div>
  `;
  },

  demoSubject: `Demo booked`,

  responseToBooker: async (date_time: string) => {
    const formattedDate = new Date(date_time).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = new Date(date_time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Your meeting has been confirmed for ${formattedDate} at ${formattedTime} with Pedxo.</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Make sure to update your calendar to be available for the meeting.</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Please note that 30 minutes before the scheduled time, our team will contact you to remind you. Thanks again! Pedxo Team</p>
    </div>
  `;
  },
};
