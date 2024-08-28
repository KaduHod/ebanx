/*GLOBAL TYPES*/
export type AppErrorCode = number | null
export type DefaultFunctionReturn<T> = {data: T | void, errorCode: AppErrorCode}

/*GLOBAL FUNCTIONS*/
export const isNumeric = (v:string): boolean => !isNaN(Number(v))

/*ERRORS*/
export const NON_EXISTING_ACCOUNT_ERR = 1;
export const INPUT_ERROR = 2;
export const ALREADY_EXISTS = 3;
export const UNKOWN_ERR = 4;


