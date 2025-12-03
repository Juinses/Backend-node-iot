/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('leds').del();
  
    await knex('leds').insert([
      { name: "LED 1", state: false },
      { name: "LED 2", state: true },
      { name: "LED 3", state: false },
    ]);
  }
  