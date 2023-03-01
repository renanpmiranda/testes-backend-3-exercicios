import { NotFoundError } from './../../src/errors/NotFoundError';
import { BadRequestError } from './../../src/errors/BadRequestError';
import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("deve disparar um erro caso email não seja string", async () => {
        expect.assertions(2)
        
        try {
            const input: LoginInputDTO = {
                email: null,                
                password: "bananinha"
            }

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'email' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso password não seja string", async () => {
        expect.assertions(2)
        
        try {
            const input: LoginInputDTO = {
                email: "example@email.com",                
                password: null
            }

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'password' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o email não esteja cadastrado", async () => {
        expect.assertions(2)
        
        try {
            const input: LoginInputDTO = {
                email: "example@email.com",                
                password: "bananinha"
            }

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'email' não cadastrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve disparar um erro caso password esteja incorreto", async () => {
        expect.assertions(2)
        
        try {
            const input: LoginInputDTO = {
                email: "normal@email.com",                
                password: "normal123"
            }

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'password' incorreto")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})