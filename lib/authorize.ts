import type { VercelRequest } from "@vercel/node";
import type { AxiosError } from "axios";

import { ApiError } from "../lib/wrapApiFunction";
import { auth0 } from "../lib/integrationClients";

const isAxiosError = (error: any): error is AxiosError => error.isAxiosError;

/**
 * Authorize auth0 user with Bearer token and return the user profile
 *
 * @param request Vercel request
 * @returns { sub: string } user object
 */
const authorize = async (request: VercelRequest): Promise<{ sub: string }> => {
  // Get the Bearer token from the request headers
  const token = request.headers.authorization?.replace(/^bearer\s/i, "");

  if (!token) throw new ApiError('Missing "Authorization" header', 401);

  try {
    // Try to get the user profile from Auth0 with that token
    return await auth0.getProfile(token);
  } catch (error) {
    // auth0 client uses axios to make requests
    if (isAxiosError(error) && error.response) {
      throw new ApiError(error.response.statusText, error.response.status);
    }

    throw new ApiError("Unauthorized", 401);
  }
};

export default authorize;
