import type { Knex } from "knex";
import { TABLE } from "../../utils/Database/table";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE.TOKEN, table => {
        table.increments('id').primary();
        table.integer("user_id").references("id").inTable(TABLE.USER).onDelete('CASCADE');
        table.string("token").nullable();
        table.integer("expire_time").defaultTo(10);
        table.string("token_type").nullable();
        table.boolean("is_used").defaultTo(false);
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
}

