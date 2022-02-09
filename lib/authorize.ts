import type { VercelRequest } from "@vercel/node";
import type { AxiosError } from "axios";

import { ApiError } from "../lib/wrapApiFunction";
import { auth0 } from "../lib/integrationClients";

const isAxiosError = (error: any): error is AxiosError => error.isAxiosError;

const authorize = async (request: VercelRequest): Promise<{ sub: string }> => {
  const token = request.headers.authorization?.replace(/^bearer\s/i, "");

  if (!token) throw new ApiError('Missing "Authorization" header', 401);

  try {
    return await auth0.getProfile(token);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new ApiError(error.response.statusText, error.response.status);
    }

    throw new ApiError("Unauthorized", 401);
  }
};

export default authorize;
