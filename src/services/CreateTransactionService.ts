import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category_title,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    const createCategory = new CreateCategoryService();

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Value wrong');
    }
    const category =
      (await categoryRepository.findOne({ title: category_title })) ||
      (await createCategory.execute({ title: category_title }));

    const category_id = category.id;

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
