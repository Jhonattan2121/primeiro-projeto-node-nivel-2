import CreateAppointmentService from "./CreateAppointmentService";

import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from "@shared/errors/AppError";

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppoitmentsRepository();
    const CreateAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const appointment = await CreateAppointment.execute({
        date: new Date(),
        provider_id: '123123',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppoitmentsRepository();
    const CreateAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

      const appointmentDate = new Date(2023 , 0 , 12 , 20);

     await CreateAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
      });

      expect(CreateAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
    })). rejects.toBeInstanceOf(AppError);
  });
});