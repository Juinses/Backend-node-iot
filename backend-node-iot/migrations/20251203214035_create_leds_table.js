/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const has = await knex.schema.hasTable("leds");
    if (!has) {
        await knex.schema.createTable("leds", (t) => {
            t.increments("id").primary();
            t.string("name", 50).notNullable();   // "LED 1", "LED 2", etc.
            t.boolean("state").notNullable().defaultTo(false); // false = apagado
            t.timestamp("created_at").defaultTo(knex.fn.now());
            t.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("leds");
}
