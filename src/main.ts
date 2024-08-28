export type AppErrorCode = number | null
export type DefaultFunctionReturn<T> = {data: T | void, errorCode: AppErrorCode}
export const isNumeric = (v:string): boolean => !isNaN(Number(v))
