import type { Knex } from "knex";
import { TABLE } from "../../utils/Database/table";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(TABLE.USER, (table) => {
        table.increments("id").primary();
        table.string("first_name").nullable();
        table.string("last_name").nullable();
        table.string("profile_image").nullable();
        table.string("email").unique().notNullable();
        table.string("password").nullable(); 
        table.string("provider").defaultTo("email"); 
        table.string("provider_id").nullable().unique();
        table.string("role").defaultTo("user");
        table.boolean("isActive").defaultTo(true);
        table.boolean("isVerified").defaultTo(false);
        table.timestamps(true, true); 
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}

