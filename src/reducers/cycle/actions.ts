import { ICycle } from '../../contexts/CycleContext'

export enum CycleReducerActionTypeEnum {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
}

export function addNewCycleAction(newCycle: ICycle) {
  return {
    type: CycleReducerActionTypeEnum.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: CycleReducerActionTypeEnum.INTERRUPT_CURRENT_CYCLE,
  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: CycleReducerActionTypeEnum.MARK_CURRENT_CYCLE_AS_FINISHED,
  }
}
