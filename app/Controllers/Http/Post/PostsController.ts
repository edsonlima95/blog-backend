import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Post from 'App/Models/Post'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'


export default class PostsController {

  private PAGE_LIMIT: number = 5

  public async index({ request }) {

    const { page } = request.qs()

    const posts = await Post.query()
      .preload("categories")
      .preload("images")
      .orderBy("id", "desc")
      .paginate(page, this.PAGE_LIMIT)

    return posts

  }

  public async store({ request }: HttpContextContract) {

    const { title, sub_title, description, user_id, categories, cover } = request.body()

    //Converte o id que vem como string para int
    const user = parseInt(user_id)

    //Recebe a image
    if (request.file("cover")) {


      const coverImage = request.file("cover", {
        extnames: ['png', 'jpg', 'jpeg']
      })

      //Valida se tem algum error de tipo
      if (!coverImage?.isValid) {
        return coverImage?.errors
      }

      //Insere a imagem na pasta
      await coverImage?.moveToDisk('./posts')

      //Obtem o nome da image
      var fileName = coverImage?.fileName
    }
    
    //salva o post
    const post = await Post.create({
      title,
      sub_title,
      description,
      user_id,
      cover: fileName
    })

    //Insere multiplas imagens se ouver
    const images = request.files('files')

    images?.map(async (image) => {

      await image.moveToDisk('./posts')

      await Image.create({
        name: image.fileName,
        post_id: post.id
      })

    })

    await post.related("categories").sync(categories)

  }

  public async edit({ params, response }: HttpContextContract) {

    const post = await Post.find(params.id)

    if (!post) {
      return response.notFound({ error: "Post não existe" })
    }

    await post.load((loader) => {
      loader.load('images')
        .load('categories')
        .load("user")
    })

    return post

  }

  public async update({ request, params, response }: HttpContextContract) {

    const { title, sub_title, description, user_id, categories, cover } = request.body()

    const post = await Post.find(params.id)

    if (!post) {
      return response.notFound({ "error": 'Post não existe' })
    }

    const coverImage = request.file("cover", {
      extnames: ['png', 'jpg', 'jpeg']
    })

    //Se for enviado uma nova imagem, deleta a atual
    if (coverImage) {
      await Drive.delete(`posts/${post.cover}`)
      await coverImage.moveToDisk('./posts')
    }
    // console.log(coverImage)
    const fileName = coverImage?.fileName ?? post.cover

    await post.merge({
      title,
      sub_title,
      description,
      user_id,
      cover: fileName
    }).save()

    const images = request.files('files')

    images?.map(async (image) => {

      await image.moveToDisk('./posts')

      await Image.create({
        name: image.fileName,
        post_id: post.id
      })

    })

    await post.related("categories").sync(categories)

  }

  public async destroy({ request, params, response }: HttpContextContract) {

    const post = await Post.find(params.id)

    if (!post) {
      return response.notFound({ "error": "Post não existe" })
    }

    await Drive.delete(`posts/${post.cover}`)

    await post.load("images")

    post.images?.map(async (image) => {
      await Drive.delete(`posts/${image.name}`)
    })

    await post.delete()

    const { page } = request.qs()
    const currentPage = page ? page : 1

    const posts = Post.query().orderBy("id","desc")
    .paginate(currentPage, this.PAGE_LIMIT)

    return posts

  }

  public async image({ params, response }) {

    const image = await Drive.getStream(`posts/${params.image}`)

    return response.stream(image);

  }

  public async removeImage({ params, response }) {


    const image = await Image.find(params.image_id)
    image?.delete()

    await Drive.delete(`posts/${image?.name}`)

  }

  public async setStatus({request, params }) {

    const post = await Post.find(params.id)

    if (post?.status === true) {
      post.status = false
      await post.save()
    } else {
      post.status = true
      await post.save()
    }

    const { page } = request.qs()
    const currentPage = page ? page : 1

    const posts = Post.query().orderBy("id","desc")
    .paginate(currentPage, this.PAGE_LIMIT)

    return posts
  }

  public async count({ response }) {
    const active = await Database
      .from('posts')
      .where("status", true)
      .count('* as total')

    const inative = await Database
      .from('posts')
      .where("status", false)
      .count('* as total')

    const post = {
      active: active[0].total,
      inative: inative[0].total,
    }

    return response.json(post)

  }

  public async postsRecent() {

    const posts = await Post.query().orderBy("created_at", "desc").limit(5)
    return posts

  }
}
