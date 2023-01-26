import ISendMailDTO from '../dtos/ISendMailDTO';
import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from "../models/IMailProvider";
import IMailTemplateprovider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateprovider,
  ) {
   nodemailer.createTestAccount().then(account => {
    const  transporter =  nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
          user: account.user,
          pass: account.pass,
      },
  });
  
  this.client = transporter;
   });
  }
 public async sendMail({to, subject, from, templateData}: ISendMailDTO): Promise<void> {
  const message =  await  this.client.sendMail({
    from: {
      name: from?.name || "Equipe GoBarber",
      address: from?.email || "equipe@Gobarber.com.br",
    },
    to: {
      name: to.name, 
      address: to.email
    },
    subject,
    html: await this.mailTemplateProvider.parse(templateData),
    
   });

  
  }
}