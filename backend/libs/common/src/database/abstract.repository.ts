import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export interface ICount {
  count: number
}

export interface IOptions {
  filter?: any,
  sort?: any,
  select?: any,
  top?: number | string,
  skip?: number | string,
  count?: boolean
}

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Partial<TDocument>): Promise<TDocument> {
    const createdDocument = new this.model(document);
    return (await createdDocument.save());
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery);

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      });

    return document;
  }

  find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery);
  }

  // Overload signatures
  async findAll(options: IOptions & { count: true }): Promise<ICount>;
  async findAll(options: IOptions): Promise<Partial<TDocument>[]>;

  async findAll(
    options: IOptions
  ): Promise<ICount | Partial<TDocument>[]> {
    const {
      filter,
      sort,
      select,
      top,
      skip,
      count
    } = options;
    let query = this.model.find({ ...(filter ?? {}) });
    if (sort) {
      query = query.sort(sort);
    }
    if (skip) {
      query = query.skip(Number(skip));
    }
    if (top) {
      query = query.limit(Number(top));
    }
    if (select) {
      query = query.select(select);
    }
    if (count) {
      return {
        count: await query.countDocuments()
      }
    }
    return query;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery);
  }

  async deleteMany(filter: FilterQuery<TDocument>) {
    return this.model.deleteMany(filter);
  }

  aggregate<T>(...aggregateArgs: Parameters<typeof Model.aggregate<T>>) {
    return this.model.aggregate(...aggregateArgs);
  }
}