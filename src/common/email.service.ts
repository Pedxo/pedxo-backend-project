import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ContractEmailDto } from '../contracts/dto/contract.email.dto';
import Mail from 'nodemailer/lib/mailer'; // still needed for attachment typing

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor() {
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      // Resend does not have verify(), so we trigger a simple request
      await this.resend.apiKeys.list();
      console.log('✅ Resend connection verified');
    } catch (err) {
      console.error('❌ Resend verify failed:', err);
    }
  }

  private escapeHtml(value = ''): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async sendMail(
    to: string,
    subject: string,
    content: string,
    from: string = process.env.OWNER_EMAIL,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `Pedxo <${from}>`,
        to,
        subject,
        html: content,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendContractEmail(contractDto: ContractEmailDto): Promise<void> {
    const emailBody = `
      <h1>New Onboarding Request</h1>

      <h2>Personal Details</h2>
      <p><strong>Client Name:</strong> ${contractDto.clientName}</p>
      <p><strong>Email:</strong> ${contractDto.email}</p>
      <p><strong>Country:</strong> ${contractDto.country}</p>
      <p><strong>State:</strong> ${contractDto.region}</p>
      <p><strong>Company Name:</strong> ${contractDto.companyName}</p>

      <h2>${contractDto.contractType} Contract</h2>
      <p><strong>Role Title:</strong> ${contractDto.roleTitle || 'N/A'}</p>
      <p><strong>Seniority Level:</strong> ${contractDto.seniorityLevel || 'N/A'}</p>
      <p><strong>Scope Of Explanation And Tech Stack Requirements:</strong> ${contractDto.scopeOfWork}</p>

      <h2>Project Timeline</h2>
      <p><strong>Start Date:</strong> ${contractDto.startDate}</p>
      <p><strong>End Date:</strong> ${contractDto.endDate || 'N/A'}</p>
      <p><strong>Explanation of Scope of Work:</strong> ${contractDto.explanationOfScopeOfWork}</p>

      <h2>Compensation and Budget</h2>
      <p><strong>Payment Rate:</strong> ${contractDto.paymentRate}</p>
      <p><strong>Payment Frequency:</strong> ${contractDto.paymentFrequency}</p>

      <p>Thank you.</p>
    `;

    await this.sendMail(
      process.env.OWNER_EMAIL,
      'New Onboarding Request',
      emailBody,
    );

    await this.sendMail(
      process.env.GMAIL_USER,
      'New Onboarding Request',
      emailBody,
    );
  }

  async sendPlainTextEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `"Pedxo" <${process.env.OWNER_EMAIL}>`,
        to,
        subject,
        text,
      });
      console.log(`Plain text email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send plain text email to ${to}:`, error);
      throw new Error('Failed to send plain text email');
    }
  }

  async sendEmailWithAttachment(
    to: string,
    subject: string,
    content: string,
    attachments: Mail.Attachment[],
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `"Pedxo" <${process.env.OWNER_EMAIL}>`,
        to,
        subject,
        html: content,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          content: a.content as any, // Resend accepts Buffer or string
        })),
      });
      console.log(`Email with attachment sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email with attachment to ${to}:`, error);
      throw new Error('Failed to send email with attachment');
    }
  }

  async sendTalentAssignmentEmail(payload: {
    talentEmail: string;
    talentName: string;
    clientName: string;
    companyName: string;
    roleTitle?: string;
    contractType: string;
  }) {
    const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0a66c2;">You've Been Assigned to a New Contract 🎉</h2>

      <p>Hello <strong>${payload.talentName}</strong>,</p>

      <p>
        You’ve been assigned to a new <strong>${payload.contractType}</strong> contract
        on <strong>Pedxo</strong>.
      </p>

      <hr />

      <h3>Contract Details</h3>
      <p><strong>Client:</strong> ${payload.clientName}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>
      <p><strong>Role:</strong> ${payload.roleTitle || 'To be discussed'}</p>

      <hr />

      <p>
        Please log in to your Pedxo dashboard to review the contract details
        and take the next steps.
      </p>

      <p style="margin-top: 24px;">
        If you have any questions, feel free to reach out.
      </p>

      <p>
        Cheers,<br />
        <strong>The Pedxo Team</strong>
      </p>
    </div>
  `;

    await this.sendMail(
      payload.talentEmail,
      'You’ve been assigned to a new contract',
      emailBody,
    );
  }

  async sendClientTalentAssignedEmail(payload: {
    to: string;
    contractId: string;
    companyName: string;
    contractType: string;
    roleTitle?: string;
    startDate: Date;
    endDate?: Date;
    talents: {
      fullName: string;
      email: string;
      roleTitle?: string;
      experienceLevel?: string;
      location?: string;
      github?: string;
      portfolio?: string;
    }[];
  }) {
    const talentsHtml = payload.talents
      .map(
        (t, i) => `
      <tr>
        <td style="padding:8px;">${i + 1}</td>
        <td style="padding:8px;">${t.fullName}</td>
         <td style="padding:8px;">${t.email}</td>
        <td style="padding:8px;">${t.roleTitle || 'N/A'}</td>
        <td style="padding:8px;">${t.experienceLevel || 'N/A'}</td>
        <td style="padding:8px;">${t.location || 'N/A'}</td>
        <td style="padding:8px;">
          ${t.github ? `<a href="${t.github}">GitHub</a>` : '—'}
          ${t.portfolio ? ` | <a href="${t.portfolio}">Portfolio</a>` : ''}
        </td>
      </tr>
    `,
      )
      .join('');

    const emailBody = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#0a66c2;">Talent Assigned Successfully ✅</h2>

      <p>Talent has been assigned to your contract.</p>

      <h3>Contract Summary</h3>
      <p><strong>Contract ID:</strong> ${payload.contractId}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>
      <p><strong>Contract Type:</strong> ${payload.contractType}</p>
      <p><strong>Role:</strong> ${payload.roleTitle || 'N/A'}</p>
      <p>
        <strong>Duration:</strong>
        ${payload.startDate.toDateString()}
        ${payload.endDate ? ` – ${payload.endDate.toDateString()}` : ''}
      </p>

      <h3>Assigned Talent</h3>

      <table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead style="background:#f5f5f5;">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Experience</th>
            <th>Location</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          ${talentsHtml}
        </tbody>
      </table>

  <p style="margin-top:20px;">
  Log in to your Pedxo dashboard to manage this contract:
  <br />
    <a href="https://pedxo.com/login" target="_blank" style="color:#0a66c2;">
    https://pedxo.com/login
    </a>
  </p>


      <p><strong>Pedxo Team</strong></p>
    </div>
  `;

    await this.sendMail(
      payload.to,
      'Talent assigned to your contract',
      emailBody,
    );
  }

  async sendOnboardingEmail(user: {
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<void> {
    const APP = 'https://pedxo.com';
    // Host these two files publicly. Emails can't read local assets.
    // const ASSETS = process.env.EMAIL_ASSETS_URL || `${APP}/email`;
    const LOGO_URL =
      'https://res.cloudinary.com/craftshop/image/upload/v1791234914/pedxo_logo_rxxqio.jpg';
    const HERO_URL =
      'https://res.cloudinary.com/craftshop/image/upload/v1791230951/onboard_image_drewpd.jpg';
    const FONT =
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
    const BRAND = '#0a66c2';

    const fullName =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'there';
    const name = this.escapeHtml(fullName);
    const email = this.escapeHtml(user.email);

    const button = (label: string, href: string) => `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="background:${BRAND};border-radius:8px;">
          <a href="${href}" target="_blank"
             style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;

    const bullets = (items: string[]) =>
      `<ul style="margin:8px 0 0;padding-left:20px;">${items
        .map((i) => `<li style="margin-bottom:6px;">${i}</li>`)
        .join('')}</ul>`;

    const step = (icon: string, title: string, body: string) => `
    <tr>
      <td width="68" valign="top" style="padding-top:28px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" valign="middle" width="44" height="44"
                style="width:44px;height:44px;background:#eaf2fb;border-radius:22px;font-size:22px;line-height:44px;">
              ${icon}
            </td>
          </tr>
        </table>
      </td>
      <td valign="top" style="padding-top:28px;font-family:${FONT};font-size:16px;line-height:24px;color:#333333;">
        <strong style="font-size:18px;color:#111111;">${title}</strong><br />
        ${body}
      </td>
    </tr>`;

    const link = (label: string, href: string) =>
      `<a href="${href}" target="_blank" style="color:${BRAND};text-decoration:none;font-weight:600;">${label}</a>`;

    const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Pedxo Talent On Demand!</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:0 16px;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- Logo -->
          <tr>
            <td style="padding:32px 0 24px;">
              <a href="${APP}" target="_blank">
                <img src="${LOGO_URL}" alt="Pedxo" width="120" style="display:block;border:0;height:auto;width:120px;" />
              </a>
            </td>
          </tr>

          <!-- Hero image -->
          <tr>
            <td>
              <img src="${HERO_URL}" alt="Welcome to Pedxo Talent On Demand" width="600"
                   style="display:block;border:0;border-radius:8px;width:100%;max-width:600px;height:auto;" />
            </td>
          </tr>

          <!-- Heading + intro -->
          <tr>
            <td style="padding-top:32px;font-family:${FONT};font-size:30px;line-height:38px;font-weight:700;color:#111111;">
              Welcome to Pedxo Talent On Demand!
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0 32px;font-family:${FONT};font-size:18px;line-height:28px;color:#333333;">
              Hi ${name},<br /><br />
              You’re all set to start using Pedxo On Demand — the best way to hire the right talent
              by using prompts, to deliver tasks for you and your company. It’s never been easier
              to get work done.
            </td>
          </tr>

          <!-- Next steps -->
          <tr>
            <td style="border-top:1px solid #e6e6e6;padding-top:32px;font-family:${FONT};font-size:20px;font-weight:700;color:#111111;">
              Next steps to start
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">

                ${step(
                  '🤖',
                  'First Autonomous hiring',
                  `Click on <strong>Create contract</strong> to explain what type of talent you're looking for —
                   role, skills, start date, region, experience level, compensation — and let the software
                   onboard the right talent for you automatically on your dashboard.<br />
                   ${link('Create a contract →', `${APP}/dashboard/create-contract`)}`,
                )}

                ${step(
                  '✍️',
                  'e-Sign and send the created contract',
                  `Review your created contract, sign and send it for the tech to start its work. The contract
                   is used to manage your hired talents specifically on the app. You can always edit it until
                   you come close to the right prompts.`,
                )}

                ${step(
                  '📄',
                  'Contract management system',
                  bullets([
                    'Go to your <strong>Contract</strong> tab to manage the agreement you have created with your hired talent and edit any section electronically. The talent will get a notification for the agreement changes.',
                    'Click on the <strong>onboarding human icon</strong> on the overview page to see all your pending contracts that the agent has not yet onboarded the right talent for, and choose to continue creating the contract.',
                    'Access your hired talent on the <strong>Teams</strong> tab.',
                  ]) +
                    `<p style="margin:10px 0 0;font-size:14px;line-height:20px;color:#666666;">
                      * You will be able to see all the information and contact details of the hired talent the
                      tech has scraped for you, from their portfolio, to their GitHub link, email address and
                      social media profiles.
                    </p>`,
                )}

                ${step(
                  '🌍',
                  'Employer of record feature',
                  bullets([
                    'Navigate to <strong>Spending</strong> to manage your payments and compensations to the hired talents based on frequency, and deposit money into the app to handle your payouts on FX-converted payments automatically.',
                    'Navigate to <strong>Expenses</strong> to manage the record of your transactions and payments to hired talents in any country. Compliance is covered automatically.',
                    'While your agent is working to onboard the right talent for you, please allow some time to connect to the right candidate and do outreach on your behalf.',
                    'Once it has found the right candidate, it will onboard the talent to your <strong>Teams</strong> tab on your dashboard. From there you can manage the talent and email them for an interview or tasks.',
                    'You can see all the information about the hired talent on your Teams tab.',
                  ]) +
                    button('Handle payouts here', `${APP}/dashboard/payroll`),
                )}

                ${step(
                  '👥',
                  'Working with hired talent',
                  bullets([
                    'Once you have been connected with your automated hired talent, you can start giving them tasks and adding them to your AI platform.',
                    'Add the hired talent to your company’s platforms on GitHub, Figma, Slack and your AI workspace to start delivery.',
                    'You can decide to interview the hired talent if you want to re-confirm before adding them to work platforms.',
                    'Find your hired talent on the <strong>Teams</strong> bar of your dashboard and start giving them tasks.',
                    'Make payment on the same dashboard when payroll is due. Easy.',
                  ]),
                )}

              </table>
            </td>
          </tr>

          <!-- Hire Talent CTA -->
          <tr>
            <td align="center" style="padding:40px 0 8px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${BRAND};border-radius:8px;">
                    <a href="${APP}/dashboard/create-contract" target="_blank"
                       style="display:inline-block;padding:16px 40px;font-family:${FONT};font-size:17px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Hire Talent
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support + use case -->
          <tr>
            <td style="padding:32px 0 8px;border-top:1px solid #e6e6e6;font-family:${FONT};font-size:16px;line-height:24px;color:#333333;">
              If you have a question about your talent sourcing and hiring process, you can reach our
              support team at
              <a href="mailto:recruit@pedxo.com" style="color:${BRAND};text-decoration:none;font-weight:600;">recruit@pedxo.com</a>.
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0 32px;font-family:${FONT};font-size:16px;line-height:24px;color:#333333;">
              <strong>Use-case:</strong> Pedxo recruits the right talent for the right tasks automatically.
              Companies use it to automate their hiring process and hire the right talent to work in the
              loop and deliver tasks with their AI models.
              ${link('See use cases →', `${APP}/#use-cases`)}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="border-top:1px solid #e6e6e6;padding:32px 0 8px;">
              <a href="${APP}" target="_blank">
                <img src="${LOGO_URL}" alt="Pedxo" width="90" style="display:block;border:0;height:auto;width:90px;margin:0 auto;" />
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 0 0;font-family:${FONT};font-size:14px;line-height:20px;">
              <a href="https://www.facebook.com/pedxo" target="_blank" style="color:#555555;text-decoration:none;padding:0 8px;">Facebook</a>
              <a href="https://www.instagram.com/pedxo" target="_blank" style="color:#555555;text-decoration:none;padding:0 8px;">Instagram</a>
              <a href="https://twitter.com/pedxo" target="_blank" style="color:#555555;text-decoration:none;padding:0 8px;">Twitter</a>
              <a href="https://www.linkedin.com/company/pedxo" target="_blank" style="color:#555555;text-decoration:none;padding:0 8px;">LinkedIn</a>
              <a href="https://www.youtube.com/@pedxo" target="_blank" style="color:#555555;text-decoration:none;padding:0 8px;">YouTube</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 0 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border:1px solid ${BRAND};border-radius:8px;">
                    <a href="${APP}/dashboard/full-time-form?contractType=full-time" target="_blank"
                       style="display:inline-block;padding:10px 24px;font-family:${FONT};font-size:14px;font-weight:600;color:${BRAND};text-decoration:none;">
                      User Help
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 0 40px;font-family:${FONT};font-size:13px;line-height:20px;color:#777777;">
              This email was sent to
              <a href="mailto:${email}" style="color:${BRAND};text-decoration:none;">${email}</a>.<br />
              This email was sent from Pedxo, a company based in Lagos, Nigeria.<br />
              Copyright © ${new Date().getFullYear()} Pedxo. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await this.sendMail(
      user.email,
      'Welcome to Pedxo Talent On Demand!',
      emailBody,
      'recruit@pedxo.com',
    );
  }

  async sendClientContractDeletedEmail(payload: {
    to: string;
    contractId: string;
    companyName: string;
    roleTitle?: string;
    contractType: string;
  }) {
    const emailBody = `
  <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6;">
    <h2 style="color:#c0392b;">Contract Successfully Terminated ❌</h2>

    <p>
      This is to confirm that your contract on Pedxo has been terminated.
    </p>

    <hr />

    <h3>Contract Summary</h3>
    <p><strong>ID:</strong> ${payload.contractId}</p>
    <p><strong>Company:</strong> ${payload.companyName}</p>
    <p><strong>Role:</strong> ${payload.roleTitle || 'N/A'}</p>
    <p><strong>Type:</strong> ${payload.contractType}</p>

    <hr />

    <p>
      If you have any questions, please contact the Pedxo team.
    </p>

    <p style="margin-top:24px;">
      Regards,<br />
      <strong>Pedxo Team</strong>
    </p>
  </div>
  `;

    await this.sendMail(
      payload.to,
      'Your contract has been terminated',
      emailBody,
    );
  }

  async sendNewUserSignupNotification(
    user: {
      _id?: any;
      firstName?: string;
      lastName?: string;
      email: string;
      userName?: string;
      provider?: string;
      isEmailVerified?: boolean;
      createdAt?: Date;
    },
    requestInfo?: {
      ip?: string;
      forwardedFor?: string | string[];
      userAgent?: string;
      origin?: string;
      referer?: string;
      timestamp?: string | Date;
    },
  ) {
    const fullName =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';

    const forwardedFor = Array.isArray(requestInfo?.forwardedFor)
      ? requestInfo.forwardedFor.join(', ')
      : requestInfo?.forwardedFor || 'N/A';

    const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0a66c2;">New User Signed Up 🎉</h2>

      <p>
        A new user has successfully created an account on
        <strong>Pedxo</strong>.
      </p>

      <hr />

      <h3>User Details</h3>

      <p><strong>User ID:</strong> ${user._id?.toString() || 'N/A'}</p>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>First Name:</strong> ${user.firstName || 'N/A'}</p>
      <p><strong>Last Name:</strong> ${user.lastName || 'N/A'}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Username:</strong> ${user.userName || 'N/A'}</p>
      <p>
        <strong>Authentication Provider:</strong>
        ${user.provider || 'Local'}
      </p>

      <p>
        <strong>Email Verified:</strong>
        ${user.isEmailVerified ? 'Yes' : 'No'}
      </p>

      <p>
        <strong>Registration Date:</strong>
        ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
      </p>

      <hr />

      <h3>Request Information</h3>

      <p>
        <strong>IP Address:</strong>
        ${requestInfo?.ip || 'N/A'}
      </p>

      <p>
        <strong>Forwarded IP:</strong>
        ${forwardedFor}
      </p>

      <p>
        <strong>User Agent:</strong>
        ${requestInfo?.userAgent || 'N/A'}
      </p>

      <p>
        <strong>Origin:</strong>
        ${requestInfo?.origin || 'N/A'}
      </p>

      <p>
        <strong>Referer:</strong>
        ${requestInfo?.referer || 'N/A'}
      </p>

      <p>
        <strong>Request Time:</strong>
        ${
          requestInfo?.timestamp
            ? new Date(requestInfo.timestamp).toLocaleString()
            : 'N/A'
        }
      </p>

      <hr />

      <p>
        This notification was automatically generated by the Pedxo system.
      </p>

      <p>
        <strong>Pedxo Team</strong>
      </p>
    </div>
  `;

    const recipients = ['victor@pedxo.com', 'bookvikxx@gmail.com'];

    await Promise.all(
      recipients.map((email) =>
        this.sendMail(email, `New User Signup - ${fullName}`, emailBody),
      ),
    );
  }

  async sendTalentContractTerminationEmail(payload: {
    to: string;
    fullName: string;
    companyName: string;
    roleTitle?: string;
    contractId: string;
  }) {
    const emailBody = `
    <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6;">
      <h2 style="color:#c0392b;">Contract Termination Notice ❌</h2>

      <p>Hello <strong>${payload.fullName}</strong>,</p>

      <p>
        This is to inform you that your assignment with
        <strong>${payload.companyName}</strong> on Pedxo has been terminated.
      </p>

      <hr />

      <h3>Contract Details</h3>
      <p><strong>Contract ID:</strong> ${payload.contractId}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>
      <p><strong>Role:</strong> ${payload.roleTitle || 'N/A'}</p>

      <hr />

      <p>
        If you believe this is an error or need clarification,
        please contact the Pedxo support team.
      </p>

      <p style="margin-top:24px;">
        Regards,<br />
        <strong>Pedxo Team</strong>
      </p>
    </div>
  `;

    await this.sendMail(payload.to, 'Contract Terminated on Pedxo', emailBody);
  }

  async sendContractUpdatedAlert(payload: {
    to: string;
    contractId: string;
    companyName: string;
    changes: {
      field: string;
      oldValue: any;
      newValue: any;
    }[];
    terminationSummary?: {
      talentName: string;
      performanceRating: number;
      terminationReason: string;
    }[];
  }) {
    const changesHtml = payload.changes
      .map(
        (c) => `
      <tr>
        <td style="padding:8px;">${c.field}</td>
        <td style="padding:8px;">${c.oldValue ?? '—'}</td>
        <td style="padding:8px;">${c.newValue ?? '—'}</td>
      </tr>
    `,
      )
      .join('');

    const terminationHtml =
      payload.terminationSummary && payload.terminationSummary.length
        ? `
      <h3 style="margin-top:25px;">Talent Termination Review</h3>

      ${payload.terminationSummary
        .map(
          (t) => `
            <div style="margin-bottom:15px;padding:10px;border:1px solid #eee;">
              <p><strong>Talent:</strong> ${t.talentName}</p>
              <p><strong>Performance Rating:</strong> ${t.performanceRating}/5</p>
              <p><strong>Reason:</strong> ${t.terminationReason}</p>
            </div>
          `,
        )
        .join('')}
    `
        : '';

    const emailBody = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#d97706;">Contract Updated ⚠️</h2>

      <p>A contract has just been edited.</p>

      <p><strong>Contract ID:</strong> ${payload.contractId}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>

      <h3>Updated Fields</h3>

      <table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead style="background:#fef3c7;">
          <tr>
            <th>Field</th>
            <th>Previous Value</th>
            <th>New Value</th>
          </tr>
        </thead>
        <tbody>
          ${changesHtml}
        </tbody>
     </table>

     ${terminationHtml}

      // <p style="margin-top:20px;">
      //   Please review this update in the admin dashboard if necessary.
      // </p>

      <p><strong>Pedxo Support Team</strong></p>
    </div>
  `;

    await this.sendMail(payload.to, 'Contract updated on Pedxo', emailBody);
  }

  async sendAdminPayoutNotification(payload: {
    adminEmail: string;
    contract: any;
    talent: {
      id: string;
      name: string;
      accountNumber: string;
      bankName: string;
    };
    amount: number;
  }) {
    const emailBody = `
    <h2>💸 Payout Processed</h2>

    <h3>Contract</h3>
    <p><strong>Company:</strong> ${payload.contract.companyName}</p>
    <p><strong>Client:</strong> ${payload.contract.clientName}</p>

    <h3>Talent Payment Details</h3>
    <p><strong>Name:</strong> ${payload.talent.name}</p>
    <p><strong>Bank:</strong> ${payload.talent.bankName}</p>
    <p><strong>Account Number:</strong> ${payload.talent.accountNumber}</p>

    <h3>Amount</h3>
    <p><strong>₦${payload.amount}</strong></p>

    <p>Please proceed with transfer.</p>
  `;

    await this.sendMail(
      payload.adminEmail,
      'Payout Ready - Transfer Talent',
      emailBody,
    );
  }

  async sendUserPayoutReceipt(payload: {
    to: string;
    amount: number;
    openingBalance: number;
    closingBalance: number;
    accountNumber: string;
    talentName: string;
  }) {
    const emailBody = `
    <h2>💳 Payment Receipt</h2>

    <p>Your payment has been processed successfully.</p>

    <h3>Transaction Details</h3>
    <p><strong>Account Number:</strong> ${payload.accountNumber}</p>
    <p><strong>Amount Debited:</strong> ₦${payload.amount}</p>
    <p><strong>Opening Balance:</strong> ₦${payload.openingBalance}</p>
    <p><strong>Closing Balance:</strong> ₦${payload.closingBalance}</p>
    <p><strong>Paid To:</strong> ${payload.talentName}</p>
    <hr />
    <p>If you have any questions, contact support.</p>

    <p><strong>Pedxo Team</strong></p>
  `;

    await this.sendMail(payload.to, 'Payment Receipt', emailBody);
  }

  async sendContractDeletedEmail(payload: {
    to: string;
    contract: {
      _id: string;
      companyName: string;
      roleTitle?: string;
      contractType: string;
      clientName: string;
      email: string;
      country: string;
      region?: string;
      startDate: Date;
      endDate?: Date;
      paymentRate: number;
      paymentFrequency: string;
      talentAssignedId?: string[];
    };
    performanceRating: number;
    terminationReason: string;
  }) {
    const talentList = payload.contract.talentAssignedId?.length
      ? payload.contract.talentAssignedId.join(', ')
      : 'None';

    const emailBody = `
  <div style="font-family:Arial,sans-serif;color:#222;">
    <h2 style="color:#c0392b;">Contract Terminated ❌</h2>

    <p>A contract has been deleted.</p>

    <h3>Contract Summary</h3>
    <p><strong>ID:</strong> ${payload.contract._id}</p>
    <p><strong>Company:</strong> ${payload.contract.companyName}</p>
    <p><strong>Client:</strong> ${payload.contract.clientName}</p>
    <p><strong>Email:</strong> ${payload.contract.email}</p>
    <p><strong>Country:</strong> ${payload.contract.country}</p>
    ${
      payload.contract.region
        ? `<p><strong>Region:</strong> ${payload.contract.region}</p>`
        : ''
    }

    <p><strong>Role:</strong> ${payload.contract.roleTitle || 'N/A'}</p>
    <p><strong>Type:</strong> ${payload.contract.contractType}</p>

    <p><strong>Start Date:</strong> ${payload.contract.startDate.toDateString()}</p>
    ${
      payload.contract.endDate
        ? `<p><strong>End Date:</strong> ${payload.contract.endDate.toDateString()}</p>`
        : ''
    }

    <p><strong>Payment:</strong> ${payload.contract.paymentRate} (${payload.contract.paymentFrequency})</p>

    <h3>Assigned Talents (IDs)</h3>
    <p>${talentList}</p>

    <h3>Termination Review</h3>
    <p><strong>Performance Rating:</strong> ${payload.performanceRating}/5 ⭐</p>
    <p><strong>Reason:</strong> ${payload.terminationReason}</p>

    <hr />

    <p style="margin-top:20px;">
      <strong>Pedxo Admin Alert</strong>
    </p>
  </div>
  `;

    await this.sendMail(payload.to, 'Contract terminated on Pedxo', emailBody);
  }
}
