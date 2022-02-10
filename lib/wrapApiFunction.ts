import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CustomError } from "ts-custom-error";

/**
 * Create a custom error class for the API to allow specifying response
 * status code with error
 *
 * Example: throw new ApiError("Method Not Allowed", 405)
 */
export class ApiError extends CustomError {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Will wrap all API functions with this helper function to handle errors
 * and responses automatically
 *
 * @param callback a Vercel API function to wrap
 */
const wrapApiFunction =
  (callback: (request: VercelRequest, response: VercelResponse) => any) =>
  async (request: VercelRequest, response: VercelResponse) => {
    try {
      await callback(request, response);

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
