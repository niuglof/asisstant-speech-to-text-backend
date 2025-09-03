import { Pool, PoolClient, QueryResult } from 'pg';

export class DatabaseService {
  private pool!: Pool;
  private static instance: DatabaseService | undefined;

  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });

    DatabaseService.instance = this;
  }

  // Get a client from the pool
  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      throw new Error(`Failed to get database client: ${error}`);
    }
  }

  // Execute a query
  async query(text: string, params?: any[]): Promise<QueryResult> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error}`);
    } finally {
      client.release();
    }
  }

  // Execute a transaction
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Execute multiple queries in a transaction
  async batchQuery(queries: Array<{ text: string; params?: any[] }>): Promise<QueryResult[]> {
    return this.transaction(async (client) => {
      const results: QueryResult[] = [];
      for (const query of queries) {
        const result = await client.query(query.text, query.params);
        results.push(result);
      }
      return results;
    });
  }

  // Insert a single record and return the inserted record
  async insert<T>(table: string, data: Record<string, any>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.query(query, values);
    return result.rows[0] as T;
  }

  // Update a record and return the updated record
  async update<T>(table: string, id: string, data: Record<string, any>, idColumn: string = 'id'): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    
    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${idColumn} = $${keys.length + 1}
      RETURNING *
    `;

    const result = await this.query(query, [...values, id]);
    return result.rows[0] as T || null;
  }

  // Delete a record
  async delete(table: string, id: string, idColumn: string = 'id'): Promise<boolean> {
    const query = `DELETE FROM ${table} WHERE ${idColumn} = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Find a single record by ID
  async findById<T>(table: string, id: string, idColumn: string = 'id'): Promise<T | null> {
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = $1 LIMIT 1`;
    const result = await this.query(query, [id]);
    return result.rows[0] as T || null;
  }

  // Find records with conditions
  async find<T>(
    table: string, 
    conditions: Record<string, any> = {}, 
    options: {
      orderBy?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<T[]> {
    let query = `SELECT * FROM ${table}`;
    const values: any[] = [];
    let paramIndex = 1;

    // Add WHERE conditions
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = $${paramIndex++}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    // Add ORDER BY
    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    }

    // Add LIMIT and OFFSET
    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows as T[];
  }

  // Count records with conditions
  async count(table: string, conditions: Record<string, any> = {}): Promise<number> {
    let query = `SELECT COUNT(*) FROM ${table}`;
    const values: any[] = [];
    let paramIndex = 1;

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = $${paramIndex++}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    const result = await this.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  // Check if database connection is healthy
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health_check');
      return result.rows[0].health_check === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Close all connections in the pool
  async close(): Promise<void> {
    try {
      await this.pool.end();
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }

  // Get pool status
  getPoolStatus(): {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  } {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}