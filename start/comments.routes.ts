import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.resource("/comments", 'Comment/CommentsController').apiOnly()
    
}).prefix('api').middleware(['auth']);