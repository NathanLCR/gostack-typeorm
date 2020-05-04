import { getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateTransactionService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category = categoryRepository.create({ title });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateTransactionService;
