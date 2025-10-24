import pool, { query } from './database';
import fs from 'fs';
import path from 'path';

export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🔍 Checking database tables...');

    // Check if users table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    const tablesExist = tableCheck.rows[0].exists;

    if (tablesExist) {
      console.log('✅ Database tables already exist, skipping migration');
      return;
    }

    console.log('🚀 Running database migrations...');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await query(schema);

    console.log('✅ Database migrations completed successfully!');
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
