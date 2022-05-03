import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostsCategories extends BaseSchema {
  protected tableName = 'posts_categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('post_id').unsigned().references('posts.id').onDelete("CASCADE")
      table.integer('category_id').unsigned().references('categories.id').onDelete("CASCADE")
      table.unique(['post_id', 'category_id'])

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
