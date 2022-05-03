import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'

export default class Category extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public slug: string

  @beforeSave()
  public static async slug(category: Category) {
    category.slug = string.dashCase(category.title)
  }

  @manyToMany(() => Post, {
    pivotTable: 'posts_categories',
    pivotForeignKey: "category_id",
    pivotRelatedForeignKey: 'post_id',
  })

  public posts: ManyToMany<typeof Post>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
