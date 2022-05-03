import Route from '@ioc:Adonis/Core/Route'

import './posts.routes'
import './authenticate.routes'
import './categories.routes'
import './comments.routes'
import './images.routes'

import './web.posts.routes'

Route.get("/post-factory",'FactoryController.index')
