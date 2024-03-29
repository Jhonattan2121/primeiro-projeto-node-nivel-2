
import { startOfHour, isBefore, getHours , format} from "date-fns";
import { injectable, inject } from 'tsyringe';
import AppError from "@shared/errors/AppError";
import Appointment from "../infra/typeorm/entities/Appointments";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) { }

  public async execute({ 
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new AppError("You cannot create an appointment with yourself.")
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You cannot create an appointment on a paste date.")
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointments between 8am and 5pm');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate,);

    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');

    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted} `,
    });

    return appointment;
  }
}
export default CreateAppointmentService;

