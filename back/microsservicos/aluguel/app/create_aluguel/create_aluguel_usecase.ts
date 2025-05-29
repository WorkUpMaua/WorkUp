import { AluguelType } from "../../shared/types";
import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";
import { CatalogoRepositoryMock } from "@catalogo/shared/repo/catalogoRepositoryMock";
import { UserRepositoryMock } from "@user/shared/repo/userRepositoryMock";

export class CreateAluguelUsecase {

    constructor(private repoAluguel: AluguelRepositoryMock, private repoUser: UserRepositoryMock, private repoCatalogo: CatalogoRepositoryMock) {}

    public execute(props: AluguelType): AluguelType {
        const currentTime = Date.now();

        const userId = this.repoUser.getUser(props.userId);

        if (!userId) {
            throw new Error("Usuário não encontrado");
        }

        const workspaceId = this.repoCatalogo.getCatalogo(props.workspaceId);

        if (!workspaceId) {
            throw new Error("Sala de trabalho não encontrada");
        }

        if (props.capacity > workspaceId.capacity) {
            throw new Error("Capacidade solicitada excede a capacidade da sala de trabalho");
        }

        const finalPrice = workspaceId.price * (props.endDate - props.startDate) / (1000 * 60 * 60 * 24); // Calcula o preço final baseado no tempo em dias

        const aluguel: AluguelType = {
            ...props,
            userId: userId.id,
            workspaceId: workspaceId.id,
            finalPrice: finalPrice,
            status: props.status || "PENDING",
            createdAt: currentTime,
            updatedAt: currentTime,
        };

        const createdAluguel = this.repoAluguel.createAluguel(aluguel);

        return createdAluguel;
    }
}