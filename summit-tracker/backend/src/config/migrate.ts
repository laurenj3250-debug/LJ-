import pool, { query } from './database';
import fs from 'fs';
import path from 'path';

// Create migrations tracking table
const createMigrationsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Check if a migration has been run
const isMigrationRun = async (name: string): Promise<boolean> => {
  const result = await query(
    'SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE migration_name = $1)',
    [name]
  );
  return result.rows[0].exists;
};

// Mark migration as run
const markMigrationRun = async (name: string): Promise<void> => {
  await query(
    'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
    [name]
  );
};

export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🔍 Checking database...');

    // Create migrations tracking table
    await createMigrationsTable();

    // Run initial schema
    const schemaRun = await isMigrationRun('initial_schema');
    if (!schemaRun) {
      console.log('🚀 Running initial schema...');
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await query(schema);
      await markMigrationRun('initial_schema');
      console.log('✅ Initial schema created');
    }

    // Run additional migrations from migrations folder
    const migrationsDir = path.join(__dirname, 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort(); // Run in alphabetical order

      for (const file of migrationFiles) {
        const migrationName = file.replace('.sql', '');
        const hasRun = await isMigrationRun(migrationName);

        if (!hasRun) {
          console.log(`🚀 Running migration: ${migrationName}...`);
          const migrationPath = path.join(migrationsDir, file);
          const migration = fs.readFileSync(migrationPath, 'utf8');
          await query(migration);
          await markMigrationRun(migrationName);
          console.log(`✅ Migration ${migrationName} completed`);
        }
      }
    }

    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
};

// Function to test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};
