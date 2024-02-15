export default class NoutFoundException extends Error {
  constructor(public message: string) {
    super(message)
  }
}
