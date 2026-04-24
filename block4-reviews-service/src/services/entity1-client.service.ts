import axios, { AxiosInstance } from "axios";
import { AppError } from "../types/app-error";

export class Entity1ClientService {
  private readonly httpClient: AxiosInstance;

  constructor(baseUrl: string, timeoutMs: number) {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      timeout: timeoutMs
    });
  }

  async ensureSeriesExists(seriesId: number): Promise<void> {
    try {
      await this.httpClient.get(`/api/v1/series/${seriesId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new AppError(`Series with id ${seriesId} was not found`, 404);
      }

      throw new AppError("Failed to validate series in the source service", 502);
    }
  }
}
