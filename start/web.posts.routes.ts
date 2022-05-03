import Route from '@ioc:Adonis/Core/Route'


Route.get("/post-image/:image", 'Web/WebController.image')//Exibe a imagem do post
Route.get("/posts",'Web/WebController.index')
Route.get("/post/:slug",'Web/WebController.postBySlug')
Route.get("/post-category/:slug",'Web/WebController.postByCategory')
