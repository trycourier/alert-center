import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CustomError } from "ts-custom-error";

export class ApiError extends CustomError {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const wrapApiFunction =
  (fn: (request: VercelRequest, response: VercelResponse) => any) =>
  async (request: VercelRequest, response: VercelResponse) => {
    try {
      await fn(request, response);

      if (!response.writableEnded) {
        response.status(204).end();
      }
    } catch (error) {
      console.error(error);

      response
        .status((error instanceof ApiError && error.statusCode) || 400)
        .json({
          error: error instanceof Error ? error.message : "Bad Request",
        });
    }
  };

export default wrapApiFunction;
