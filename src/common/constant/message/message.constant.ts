export const ResponseMessage = {
  toOwnerTemplate: (name: string) => {
    return `${name} just send project for outsource, kindly use the admin dashboard to check it out`;
  },
  subject: `Project OutSource`,

  ResponseSender: `Your project has been receive, wait for feedback`,

  toOwnerDemoTemplate: (name: string, date: string) => {
    return `${name} just book a demo with you by ${date} kindly set reminder`;
  },

  demoSubject: `Demo booked`,

  ResponseDemoSender: `Demo booked successfully`,
};
