import { describe, it, expect, vi} from "vitest";
import { createUsuarios } from "../controllers/usuariosControllers.js"
import { createUsuariosModel } from "../models/usuariosModel.js"
vi.mock("../models/usuariosModel.js")


describe("createUsuarios", () => {

    it("Deve criar os usuarios",async() =>{
        //arrange
        const usuariosCriado = {
            id: 1,
            email: "joaolima12@gmail.com"
        };

        createUsuariosModel.mockResolvedValue(usuariosCriado)

      const req = {
        body: {
            email: "joaolima12@gmail.com",
            senha: "joaolimas@34a"
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      }
      const next = vi.fn()

        // act
        const creatd = await createUsuarios(req,res, next)

        //Assert
        expect(res.status).toHaveBeenCalledWith(201)


    })


})