import { Aluguel } from "./interfaces";

export type updateAluguelProps = Pick<Aluguel, "id"> & Partial<Omit<Aluguel, "id" | "userId" | "workspaceId" | "createdAt" | "updatedAt">>