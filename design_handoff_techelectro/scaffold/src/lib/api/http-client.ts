import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { apiConfig } from "./config";
import type { ApiErrorDto, ApiResponse } from "@/lib/dto/common.dto";

/**
 * Тонкая обёртка над axios. Один инстанс на всё приложение.
 *
 * Зачем класс, а не голый axios:
 * - Единая точка для интерцепторов (auth header, обработка 401, лог).
 * - Возвращает уже распакованный data (большинство ответов имеют вид { data: ... }).
 * - Удобно мокать в тестах и переопределять baseUrl.
 */
export class HttpClient {
  private readonly instance: AxiosInstance;
  private getToken: () => string | null = () => null;
  private onUnauthorized: () => void = () => {};

  constructor(baseURL: string = apiConfig.baseUrl) {
    this.instance = axios.create({
      baseURL,
      timeout: apiConfig.timeoutMs,
      headers: { "Content-Type": "application/json" },
    });

    this.instance.interceptors.request.use((cfg) => this.attachAuth(cfg));
    this.instance.interceptors.response.use(
      (res) => res,
      (err: AxiosError) => this.handleError(err),
    );
  }

  /** Регистрирует, откуда брать токен (обычно из Zustand auth-store). */
  setAuthTokenProvider(provider: () => string | null) {
    this.getToken = provider;
  }

  /** Регистрирует колбэк на 401 — например, разлогинить пользователя. */
  setOnUnauthorized(handler: () => void) {
    this.onUnauthorized = handler;
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<ApiResponse<T>>(url, config).then(this.unwrap);
  }

  post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return this.instance.post<ApiResponse<T>>(url, body, config).then(this.unwrap);
  }

  put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return this.instance.put<ApiResponse<T>>(url, body, config).then(this.unwrap);
  }

  patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
    return this.instance.patch<ApiResponse<T>>(url, body, config).then(this.unwrap);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<ApiResponse<T>>(url, config).then(this.unwrap);
  }

  private attachAuth(cfg: InternalAxiosRequestConfig) {
    const token = this.getToken();
    if (token) {
      cfg.headers.set("Authorization", `Bearer ${token}`);
    }
    return cfg;
  }

  private unwrap = <T>(res: AxiosResponse<ApiResponse<T>>): T => res.data.data;

  private handleError = (err: AxiosError): Promise<never> => {
    if (err.response?.status === 401) {
      this.onUnauthorized();
    }
    const payload = err.response?.data as { error?: ApiErrorDto } | undefined;
    const normalized: ApiErrorDto = payload?.error ?? {
      code: err.code ?? "UNKNOWN",
      message: err.message ?? "Сетевая ошибка",
    };
    return Promise.reject(normalized);
  };
}

/** Глобальный инстанс. Если нужны разные baseUrl, создавайте свои. */
export const httpClient = new HttpClient();
