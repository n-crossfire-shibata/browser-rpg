export class ExhaustiveError extends Error {
  constructor(value: never, message = `Unsupported action type: ${JSON.stringify(value)}`) {
    super(message);
  }
}