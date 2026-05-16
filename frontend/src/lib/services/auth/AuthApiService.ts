import type { IAuthService } from "../types";
import type { AuthCredentialsDto, AuthSessionDto, UserDto, RegisterDto } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class AuthApiService implements IAuthService {
  constructor(private readonly http: HttpClient = httpClient) {}

  login(creds: AuthCredentialsDto) {
    return this.http.post<AuthSessionDto>(endpoints.auth.login, creds);
  }

  register(payload: RegisterDto) {
    return this.http.post<AuthSessionDto>(endpoints.auth.register, payload);
  }

  async logout() {
    await this.http.post<void>(endpoints.auth.logout).catch(() => {});
  }

  async me(): Promise<UserDto | null> {
    try {
      return await this.http.get<UserDto>(endpoints.auth.me);
    } catch {
      return null;
    }
  }
}
