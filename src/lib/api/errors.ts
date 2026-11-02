export type ApiRequestErrorInit = {
  /** وضعیت HTTP؛ ۰ یعنی اصلاً پاسخی نیامد (قطعی اینترنت) */
  status: number;
  code: string;
  /** متن قابل‌نمایش به کاربر */
  message: string;
  path?: string;
};

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly path?: string;

  constructor(init: ApiRequestErrorInit) {
    super(init.message);
    this.name = "ApiRequestError";
    this.status = init.status;
    this.code = init.code;
    this.path = init.path;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}
