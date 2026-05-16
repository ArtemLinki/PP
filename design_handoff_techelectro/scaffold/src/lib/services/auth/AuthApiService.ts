import type { IAuthService } from "../types";
import type { AuthCredentialsDto, AuthSessionDto, UserDto } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class AuthApiService implements IAuthService {
  constructor(private readonly http: HttpClient = httpClient) {}

  login(creds: AuthCredentialsDto) {
    return this.http.post<AuthSessionDto, AuthCredentialsDto>(endpoints.auth.login, creds);
  }
  async logout() {
    await this.http.post<void>(endpoints.auth.logout);
  }
  async me(): Promise<UserDto | null> {
    try {
      return await this.http.get<UserDto>(endpoints.auth.me);
    } catch {
      return null;
    }
  }
}
