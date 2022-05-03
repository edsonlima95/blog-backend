import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Image from './Image'
import Category from './Category'
import User from './User'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public sub_title: string | null
  
  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public status: boolean

  @column()
  public cover: string

  @hasMany(() => Image, {
    foreignKey: "post_id"
  })
  public images: HasMany<typeof Image>

  @belongsTo(() => User, {
    foreignKey: "user_id"
  })
  public user: BelongsTo<typeof User>

  @column()
  public user_id: number

  @beforeSave()
  public static async slug(post: Post) {
    post.slug = string.dashCase(post.title)
  }

  @manyToMany(() => Category, {
    pivotTable: 'posts_categories',
    pivotForeignKey: "post_id",
    pivotRelatedForeignKey: 'category_id',
  })

  public categories: ManyToMany<typeof Category>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
