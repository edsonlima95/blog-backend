import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string("title").notNullable()
      table.string("sub_title").nullable()
      table.string("slug").nullable()
      table.string("description").notNullable()
      table.boolean("status").defaultTo(true)
      table.string("cover").notNullable()

      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
