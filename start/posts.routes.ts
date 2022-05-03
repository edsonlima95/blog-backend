import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get("/post-image/:image", 'Post/PostsController.image')//Exibe a imagem do post
    Route.get("/posts/remove-image/:image_id", 'Post/PostsController.removeImage')//Remove a imagem do post
    Route.get("/posts/count", 'Post/PostsController.count')
    Route.get("/posts/recents", 'Post/PostsController.postsRecent')

    Route.patch("/posts/status/:id", "Post/PostsController.setStatus")
    Route.resource("/posts", 'Post/PostsController').except(['create', 'show'])


}).prefix('api').middleware(['auth']);


