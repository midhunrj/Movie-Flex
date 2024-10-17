import { iScreenRepository } from "../repositories/iScreenRepository";
import { Screen } from '../../Domain/entities/screens';

export class CreateScreenUseCase {
  constructor(private screenRepository: iScreenRepository) {}

  async execute(screenData: Screen): Promise<Screen> {
    return await this.screenRepository.create(screenData);
  }
}

export class GetScreensByTheatreUseCase {
  constructor(private screenRepository: iScreenRepository) {}

  async execute(theatreId: string): Promise<Screen[]> {
    return await this.screenRepository.findByTheatre(theatreId);
  }
}
