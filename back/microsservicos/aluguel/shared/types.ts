export type AluguelType = {
  id: string;
  userId: string;
  workspaceId: string;
  startDate: number;
  endDate: number;
  capacity: number;
  finalPrice: number;
  status: string;
  createdAt: number;
  updatedAt: number;
};

export type updateAluguelProps = {
  id: string
  startDate?: number
  endDate?: number
  finalPrice?: number
  capacity?: number
  status?: string
}