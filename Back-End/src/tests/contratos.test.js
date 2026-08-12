import { describe, it, expect, vi } from "vitest"
import { createContrato } from "../controllers/contratosControllers.js"
import { createContratoModel } from "../models/contratosModel.js"

vi.mock("../models/contratosModel.js")

describe("Criar Contratos", () =>{

    it("Deve criar os contratos", async () =>{

        // arrange
        const contratoCriado = {
            id: 1,
            data_inicio: "20/10/2026",
            data_fim: "20/10/2027",
            valor: 1200
        }

        createContratoModel.mockResolvedValue(contratoCriado)

        const req = {
            body: {
                data_inicio: "20/10/2026",
            data_fim: "20/10/2027",
            valor: 1200
            }
             
        }
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        const next = vi.fn()


        //act
        const result = await createContrato(req, res, next)

        //expect
        expect(res.status).toHaveBeenCalledWith(201)
    })


})