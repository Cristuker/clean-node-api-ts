export class InvalidParamError extends Error {
  constructor(paramName: any) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamError';
  }
}
