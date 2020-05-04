import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
// import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<Transaction | null> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = (await transactionRepository.findOne({ id })) || null;

    await transactionRepository.delete({ id });

    return transaction;
  }
}

export default DeleteTransactionService;
