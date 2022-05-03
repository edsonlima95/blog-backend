import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {


    Route.resource("/images", 'Image/ImagesController').apiOnly().only['destroy']

}).prefix('api').middleware(['auth']);