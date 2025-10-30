export interface IAlgorithm<TState> {
    run(state: TState): TState;
    step(state: TState): TState;
}
