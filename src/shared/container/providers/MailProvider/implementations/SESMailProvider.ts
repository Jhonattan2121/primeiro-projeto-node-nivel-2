import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import { injectable, inject } from 'tsyringe';

import IMailTemplateprovider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from "../models/IMailProvider";
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateprovider,
  ) {
   this.client = nodemailer.createTransport({
    SES: new aws.SES({
      apiVersion: '2010-12-01',
      region: 'Global',
    }),
   });
  }
  public async sendMail({ 
    to, 
    subject, 
    from, 
    templateData, 
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

   await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
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