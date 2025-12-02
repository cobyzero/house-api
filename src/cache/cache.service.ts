import { Injectable } from '@nestjs/common';
import Database from 'better-sqlite3';
@Injectable()
export class CacheService {
  private db: Database.Database;

  constructor() {
    this.db = new Database('ia_cache.db');

    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        input TEXT UNIQUE,
        response TEXT
      )
    `,
      )
      .run();
  }
  getCached(input: string): string | null {
    const row = this.db
      .prepare(`SELECT response FROM cache WHERE input = ?`)
      .get(input);
    return row ? row.response : null;
  }

  saveCache(input: string, response: string) {
    this.db
      .prepare(`INSERT OR REPLACE INTO cache (input, response) VALUES (?, ?)`)
      .run(input, response);
  }
}
