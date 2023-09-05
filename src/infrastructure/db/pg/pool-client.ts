import { PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';

interface IPoolClientSettings {
  logQueries: boolean;
}

export class PoolClientDecorator {
  constructor(
    private _client: PoolClient,
    private settings: IPoolClientSettings = { logQueries: true },
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query<R extends QueryResultRow = any, I extends unknown[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I,
  ): Promise<QueryResult<R>> {
    if (this.settings.logQueries) {
      console.log(queryTextOrConfig);
    }

    return await this._client.query(queryTextOrConfig, values);
  }

  release(err?: Error | boolean): void {
    this._client.release(err);
  }
}
