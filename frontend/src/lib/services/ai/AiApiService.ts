import type { IAiService } from "../types";
import type { AiPromptDto, AiPromptResponseDto, AiMessageDto, ID } from "@/lib/dto";
import { httpClient, HttpClient } from "@/lib/api/http-client";
import { endpoints } from "@/lib/api/endpoints";

export class AiApiService implements IAiService {
  constructor(private readonly http: HttpClient = httpClient) {}
  prompt(payload: AiPromptDto) {
    return this.http.post<AiPromptResponseDto, AiPromptDto>(endpoints.ai.prompt, payload);
  }
  getConversation(id: ID) {
    return this.http.get<AiMessageDto[]>(endpoints.ai.conversation(id));
  }
}
