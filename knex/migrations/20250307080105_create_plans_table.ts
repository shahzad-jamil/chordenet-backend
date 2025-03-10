import type { Knex } from "knex";
import { TABLE } from "../../utils/Database/table";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE.PLAN, (table) => {
        table.increments("id").primary();
        table.string("plan_name").notNullable();
        table.decimal("plan_price").notNullable();
        table.string("time_interval").notNullable().defaultTo("month");
        table.string("stripe_price_id").nullable();
        table.string("plan_type").nullable();
        table.string("stripe_product_id").nullable();
        table.string("status").defaultTo("active");
        table.string("currency").defaultTo("usd");
        table.string("plan_title").nullable();
        table.jsonb("features").nullable();
        table.boolean("is_popular").defaultTo(false);
        table.timestamps(true,true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE.PLAN);
}

