import { PostFactory } from "Database/factories"

export default class FactoryController {


    public async index({response}){

       const posts = await PostFactory.createMany(10)

        return response.send("ok")
    }

}