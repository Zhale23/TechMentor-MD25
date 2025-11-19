import AppDataSource from './data-source';
import { DataSource } from 'typeorm';

describe('DataSource', () => {
  it('should export a TypeORM DataSource instance', () => {
    expect(AppDataSource).toBeDefined();
    // The DataSource class may be used by TypeORM; verify basic shape
    expect(AppDataSource).toBeInstanceOf(DataSource);
  });
});
