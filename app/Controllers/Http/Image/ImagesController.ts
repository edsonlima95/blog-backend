import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Drive from '@ioc:Adonis/Core/Drive'

export default class ImagesController {
  // public async index({ }: HttpContextContract) { }

  // public async store({ }: HttpContextContract) { }

  // public async show({ }: HttpContextContract) { }

  // public async update({ }: HttpContextContract) { }

  public async destroy({ params }: HttpContextContract) {

    const image = await Image.findOrFail(params.id)

    await image.delete()

    await Drive.delete(`posts/${image.name}`)

  }
}
