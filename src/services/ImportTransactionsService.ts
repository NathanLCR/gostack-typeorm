/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import csvParser from 'csv-parse';
import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import CreateCategory from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  filePath: string;
}

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_title: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    const createCategory = new CreateCategory();
    const readCSVStream = fs.createReadStream(filePath);

    const parses = csvParser({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parses);

    const transactions: TransactionDTO[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category_title] = line;

      transactions.push({ title, type, value, category_title });
    });

    await new Promise(resolve => {
      return parseCSV.on('end', resolve);
    });

    for (const transaction of transactions) {
      const category =
        (await categoryRepository.findOne({
          title: transaction.category_title,
        })) ||
        (await createCategory.execute({ title: transaction.category_title }));
      transaction.category_title = category.id;
    }

    const createdTransaction = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category_id: transaction.category_title,
      })),
    );

    const transactionsSaved = await transactionRepository.save(
      createdTransaction,
    );

    await fs.promises.unlink(filePath);

    return transactionsSaved;
  }
}

export default ImportTransactionsService;
