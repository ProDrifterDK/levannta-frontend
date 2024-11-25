import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const uploadPortfolio = async (
  file: File
): Promise<{ clientId: string; maxAdvance: number }[]> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const applyLoan = async (data: { clientId: string; amount: number }) => {
  const response = await api.post("/portfolio/apply-loan", data);
  return response.data;
};

export const getLoanStatus = async (
  clientId: string
): Promise<{ clientId: string; status: string }> => {
  const response = await api.get(`/portfolio/loan-status`, {
    params: { clientId },
  });
  return response.data;
};

export const getClients = async (): Promise<
  { clientId: string; maxAdvance: number }[]
> => {
  const response = await api.get("/portfolio");
  return response.data;
};
