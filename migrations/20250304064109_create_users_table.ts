import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("first_name").nullable();
        table.string("last_name").nullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.timestamps(true, true); 
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}

