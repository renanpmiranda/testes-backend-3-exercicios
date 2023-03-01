import { NotFoundError } from './../../src/errors/NotFoundError';
import { BadRequestError } from './../../src/errors/BadRequestError';
import { DeleteUserInputDTO } from './../../src/dtos/userDTO';
import { UserBusiness } from './../../src/business/UserBusiness';
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";

describe("deleteUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve receber um token de admin e um id a ser deletado", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token:"token-mock-admin"
        }

        await userBusiness.deleteUser(input)
        
    })

    test("deve disparar um erro caso token não seja string", async () => {
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: null
            }

            await userBusiness.deleteUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("requer token")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o token seja inválido", async () => {
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: "token-mock-invalido"
            }

            await userBusiness.deleteUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o token não seja de admin", async () => {
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: "token-mock-normal"
            }

            await userBusiness.deleteUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("somente admins podem deletar contas")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro caso o id não seja encontrado", async () => {
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-naoexiste",
                token: "token-mock-admin"
            }

            await userBusiness.deleteUser(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})