export default class UnprocessableEntityException extends Error {
  constructor(public message: string) {
    super(message)
  }
}
