import User from "App/Models/User"

interface IUserResponse {
    user: {
        id: number,
        first_name: string,
        last_name?: string,
        email: string
    },
    token: string,
}
export default class AuthController {

    /**
     * signIn
     */
    public async signIn({ request }) {

        const { first_name, last_name, email, password } = request.body()

        await User.create({
            first_name,
            last_name,
            email,
            password
        })

    }

    /**
     * login
     */
    public async login({ auth, request, response }) {

        const { email, password } = request.body()


        try {

            const res = await auth.use('api').attempt(email, password, {
                expiresIn: '1days'
            })

            const apiResponse: IUserResponse = {
                user: {
                    id: auth.user.id,
                    first_name: auth.user.first_name,
                    last_name: auth.user.last_name,
                    email: auth.user.email
                },
                token: res.token,
            }

            return apiResponse

        } catch {
            return response.badRequest({ error: 'E-mail ou senha incorretos' })
        }
    }

    /**
     * async checkToken
     */
    public async checkToken({ response, auth }) {

        try {

            await auth.use('api').authenticate()
            return auth.use('api').isAuthenticated

        } catch {
            return response.unauthorized({ error: 'invalid token' })
        }
    }

}
