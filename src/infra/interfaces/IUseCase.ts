export default interface IUseCase<TParams, TResponse> {
  execute(params: TParams): Promise<TResponse>
}
