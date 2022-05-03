import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'


export default class CategoriesController {

  // private page_limit: number = 5
  private PAGE_LIMIT: number = 5

  async index({ request }) {

    const { page } = request.qs()

    const currentPage = page ? page : 1

    const categories = Category.query().orderBy("id", "desc").paginate(currentPage, this.PAGE_LIMIT)

    return categories

  }


  async store({ request }: HttpContextContract) {

    const { title, description } = request.body()

    const category = await Category.create({
      title,
      description
    })

    return category

  }

  async edit({ params }: HttpContextContract) {

    const category = await Category.find(params.id)

    return category

  }

  async update({ request, params }: HttpContextContract) {

    const { title, description } = request.body()

    const category = await Category.find(params.id)

    await category?.merge({
      title,
      description
    }).save()

    return category

  }

  async destroy({ request, params, response }: HttpContextContract) {

    const category = await Category.find(params.id)

    if (!category) {
      return response.notFound({ error: 'Categória não pode ser encontrada' })
    }

    await category.load("posts")

    if (category.posts?.length > 0) {

      return response.internalServerError({ error: 'Você não pode deletar uma categória que contém posts' })
    }

    await category.delete()

    const { page } = request.qs()
    const currentPage = page ? page : 1

    const categories = Category.query()
    .orderBy("id","desc")
    .paginate(currentPage, this.PAGE_LIMIT)

    return categories

  }

  public async count() {
    const users = await Database
      .from('categories')
      .count('* as total')

    return users[0].total

  }
}
