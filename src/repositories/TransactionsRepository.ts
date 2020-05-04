import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomes = await this.find({ type: 'income' });
    const income = incomes.reduce(function (sum, transaction) {
      return sum + transaction.value;
    }, 0);
    const outcomes = await this.find({ type: 'outcome' });
    const outcome = outcomes.reduce(function (sum, transaction) {
      return sum + transaction.value;
    }, 0);
    const balance: Balance = {
      total: income - outcome,
      income,
      outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
