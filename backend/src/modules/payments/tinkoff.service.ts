import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class TinkoffService {
  private readonly logger = new Logger(TinkoffService.name);
  private readonly baseUrl: string;
  private readonly terminalKey: string;
  private readonly password: string;
  private readonly frontendUrl: string;
  private readonly backendUrl: string;

  constructor(private config: ConfigService) {
    const isTest = config.get('TINKOFF_TEST_MODE') !== 'false';
    this.baseUrl = isTest
      ? 'https://rest-api-test.tinkoff.ru/v2'
      : 'https://securepay.tinkoff.ru/v2';
    this.terminalKey = config.get('TINKOFF_TERMINAL_KEY') ?? 'TinkoffBankTest';
    this.password = config.get('TINKOFF_PASSWORD') ?? 'TinkoffBankTest';
    this.frontendUrl = config.get('FRONTEND_URL') ?? 'http://localhost:3000';
    this.backendUrl = config.get('BACKEND_URL') ?? 'http://localhost:3001/api';
  }

  private sign(params: Record<string, string | number | boolean>): string {
    const entries: Record<string, string | number | boolean> = { ...params, Password: this.password };
    delete entries['Token'];
    delete entries['Receipt'];
    delete entries['DATA'];
    const sorted = Object.keys(entries)
      .sort()
      .map((k) => String(entries[k]))
      .join('');
    return createHash('sha256').update(sorted).digest('hex');
  }

  verifySignature(params: Record<string, string | number | boolean>): boolean {
    const { Token, ...rest } = params;
    const expected = this.sign(rest);
    return expected === String(Token).toLowerCase();
  }

  async createPayment(orderId: string, amountMinor: number, description: string) {
    const body: Record<string, string | number> = {
      TerminalKey: this.terminalKey,
      Amount: amountMinor,
      OrderId: orderId,
      Description: description,
      SuccessURL: `${this.frontendUrl}/orders?payment=success&orderId=${orderId}`,
      FailURL: `${this.frontendUrl}/orders?payment=fail&orderId=${orderId}`,
      NotificationURL: `${this.backendUrl}/payments/webhook`,
    };
    body['Token'] = this.sign(body);

    try {
      const res = await fetch(`${this.baseUrl}/Init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        Success: boolean;
        PaymentId: string;
        PaymentURL: string;
        ErrorCode?: string;
        Message?: string;
      };

      if (!data.Success) {
        this.logger.error(`Tinkoff Init failed: ${data.Message} (${data.ErrorCode})`);
        return null;
      }

      return { paymentId: String(data.PaymentId), paymentUrl: data.PaymentURL };
    } catch (err) {
      this.logger.error('Tinkoff API error', err);
      return null;
    }
  }

  async getState(orderId: string, paymentId: string) {
    const body: Record<string, string | number> = {
      TerminalKey: this.terminalKey,
      PaymentId: paymentId,
    };
    body['Token'] = this.sign(body);

    try {
      const res = await fetch(`${this.baseUrl}/GetState`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        Success: boolean;
        Status: string;
        OrderId: string;
      };
      return data.Success ? data.Status : null;
    } catch {
      return null;
    }
  }
}
