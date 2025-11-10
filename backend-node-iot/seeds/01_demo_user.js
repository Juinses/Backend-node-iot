import bcrypt from 'bcryptjs';

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('users').del();
  const hash = await bcrypt.hash('123456', 10);
  await knex('users').insert([
    { name: 'Demo', email: 'demo@example.com', password_hash: hash }
  ]);
}
