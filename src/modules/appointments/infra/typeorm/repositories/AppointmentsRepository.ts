import { getRepository , Repository } from "typeorm";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import Appointment from "../entities/Appointment";

//solid

//liskov substitution principle

class AppointmentsRepository implements IAppointmentsRepository {
  find() {
    throw new Error("Method not implemented.");
  }
  private ormRepository: Repository<Appointment>;
  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise <Appointment | undefined> { //um por data 
      const findAppointment = await this.ormRepository.findOne({
        where: {date},
      });
      return findAppointment || null; 

  }
  public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({provider_id, date});

    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;