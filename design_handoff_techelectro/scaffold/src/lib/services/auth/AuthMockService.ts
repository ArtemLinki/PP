import type { IAuthService } from "../types";
import type { AuthCredentialsDto, AuthSessionDto, UserDto } from "@/lib/dto";
import { delay, nextId } from "../_utils";

export class AuthMockService implements IAuthService {
  private session: AuthSessionDto | null = null;

  async login(creds: AuthCredentialsDto): Promise<AuthSessionDto> {
    await delay();
    if (!creds.email || creds.password.length < 4) {
      throw { code: "INVALID_CREDS", message: "Неверный логин или пароль" };
    }
    const user: UserDto = {
      id: nextId("user"),
      email: creds.email,
      fullName: creds.email.split("@")[0],
      role: creds.email.startsWith("admin") ? "admin" : "customer",
      createdAt: new Date().toISOString(),
    };
    this.session = {
      user,
      token: {
        accessToken: "mock-access-" + Math.random().toString(36).slice(2),
        refreshToken: "mock-refresh-" + Math.random().toString(36).slice(2),
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      },
    };
    return this.session;
  }

  async logout() {
    await delay(80);
    this.session = null;
  }

  async me(): Promise<UserDto | null> {
    await delay(80);
    return this.session?.user ?? null;
  }
}
