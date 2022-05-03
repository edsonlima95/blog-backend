// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database';
import Category from 'App/Models/Category';
import Post from "App/Models/Post";

export default class WebController {

    public async index({ request }) {

        const { page } = request.qs()

        const limit = 9;

        const posts = await Post.query()
            .offset(3)
            .where('status', true)
            .orderBy('id', 'desc')
            .preload("user")
            .preload("categories")
            .paginate(page, limit)

        // const postsRecents = await Post
        //     .query()
        //     .where('status', true)
        //     .preload("categories")
        //     .preload("user")
        //     .limit(3)

        const { rows: postsRecents } = await Database.rawQuery('select * from posts order by random() limit 3')

        return { posts, postsRecents }

    }

    public async postBySlug({ params, response }) {


        const post = await Post.findBy("slug", params.slug)

        if (!post) {
            return response.notFound({ error: "Post não existe" })
        }

        await post.load("categories")

        const category = await Category.query()
            .where('id', post.categories[0].id)
            .preload("posts", (query) => {
                query.where('post_id', '!=', post.id).limit(3)
            })

        return { post, category }

    }

    public async postByCategory({ params, response }) {


        const category = await Category.findBy("slug", params.slug)


        if (!category) {
            return response.notFound({ error: "Categória não existe" })
        }

        await category.load("posts", (query) => {
            query.preload("user")
        })

        return category

    }

    public async image({ params, response }) {

        const image = await Drive.getStream(`posts/${params.image}`)

        return response.stream(image);

    }

}
