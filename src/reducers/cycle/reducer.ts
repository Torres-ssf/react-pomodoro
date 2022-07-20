import { ICycle } from '../../contexts/CycleContext'
import { CycleReducerActionTypeEnum } from './actions'

interface ICycleState {
  cycles: ICycle[]
  activeCycleId: string | undefined
}

export function cycleReducer(state: ICycleState, action: any) {
  switch (action.type) {
    case CycleReducerActionTypeEnum.ADD_NEW_CYCLE:
      return {
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id as string,
      }
    case CycleReducerActionTypeEnum.INTERRUPT_CURRENT_CYCLE:
      return {
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              interruptedDate: Date.now(),
            }
          }
          return cycle
        }),
        activeCycleId: undefined,
      }
    case CycleReducerActionTypeEnum.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              finishedDate: Date.now(),
            }
          }
          return cycle
        }),
        activeCycleId: undefined,
      }
    default:
      return state
  }
}
