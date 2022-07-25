import { ICycle } from '../../contexts/CycleContext'
import { CycleReducerActionTypeEnum } from './actions'

export interface ICycleState {
  cycles: ICycle[]
  activeCycleId: string | undefined
}

interface ICycleReducerAction {
  type: string
  payload?: any
}

export function cycleReducer(
  state: ICycleState,
  action: ICycleReducerAction
): ICycleState {
  switch (action.type) {
    case CycleReducerActionTypeEnum.ADD_NEW_CYCLE:
      return {
        cycles: [action.payload.newCycle, ...state.cycles],
        activeCycleId: action.payload.newCycle.id,
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
        ...state,
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              finishedDate: Date.now(),
            }
          }
          return cycle
        }),
      }

    case CycleReducerActionTypeEnum.USER_IS_AWARE_CYCLE_FINISHED:
      return {
        ...state,
        activeCycleId: undefined,
      }

    case CycleReducerActionTypeEnum.DELETE_CYCLES_HISTORY:
      return {
        ...state,
        cycles: state.cycles.filter(cycle => {
          return cycle.id === state.activeCycleId
        }),
      }

    default:
      return state
  }
}
