import type { AxiosError } from "axios";

const isAxiosError = (error: any): error is AxiosError => error.isAxiosError;

export default isAxiosError;
