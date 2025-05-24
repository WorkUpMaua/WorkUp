type informationType = {
    name: string
    email: string
    cpf: string
    birth: number
    phone: string
}

type authType = {
    username: string
    password: string
}

interface User {
    auth: authType
    information: informationType
}

type baseUserType = {
    [key: string]: User
}

export class UserRepositoryMock {

    private baseUser: baseUserType = {}

    public getAllUser(): baseUserType {
        return this.baseUser
    }

}