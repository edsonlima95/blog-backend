import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    
    Route.get("/categories/count",'Category/CategoriesController.count')
    Route.resource("/categories", 'Category/CategoriesController').except(['create','show'])

    
}).prefix('api').middleware(['auth']);