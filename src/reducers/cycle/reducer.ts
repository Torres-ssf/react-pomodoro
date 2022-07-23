import { ICycle } from '../../contexts/CycleContext'
import { CycleReducerActionTypeEnum } from './actions'

export interface ICycleState {
  cycles: ICycle[]
  activeCycleId: string | undefined
  isCycleFinished: boolean
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
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    case CycleReducerActionTypeEnum.INTERRUPT_CURRENT_CYCLE:
      return {
        ...state,
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
        isCycleFinished: true,
      }
    case CycleReducerActionTypeEnum.SET_CYCLE_AS_NOT_FINISHED:
      return {
        ...state,
        isCycleFinished: false,
      }
    default:
      return state
  }
}
