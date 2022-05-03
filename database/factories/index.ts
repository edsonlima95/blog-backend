import Post from '../../app/Models/Post'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const PostFactory = Factory
  .define(Post, ({ faker }) => {
    return {
      title: faker.lorem.sentence(10),
      sub_title: faker.lorem.sentence(20),
      description: faker.lorem.sentence(1000),
      status: true,
      cover: 'cl2g55sv700010kui14ppbt3b.png',
      user_id: 5,
    }
  }).build()