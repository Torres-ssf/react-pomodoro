import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { INewCycleFormData } from '../pages/Home/components/CycleForm'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycle/actions'
import { cycleReducer } from '../reducers/cycle/reducer'

export interface ICycle {
  id: string
  task: string
  minutes: number
  startDate: number
  interruptedDate?: number
  finishedDate?: number
}

export interface ICycleContextProps {
  cycles: ICycle[]
  activeCycle: ICycle | undefined
  activeCycleId: string | undefined
  amountPassedInSec: number
  setAmountPassed: (amount: number) => void
  createNewCycle: (data: INewCycleFormData) => void
  markCurrentCycleAsFinished: () => void
  interruptCurrentCycle: () => void
}

export const CycleContext = createContext<ICycleContextProps>({} as any)

interface ICycleContextProviderProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: ICycleContextProviderProps) {
  const [state, dispatch] = useReducer(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: undefined,
    },
    () => {
      const storedStateJson = localStorage.getItem(
        '@react-pomodoro:cycle-state-1.0.0'
      )

      if (storedStateJson) {
        return JSON.parse(storedStateJson)
      }
    }
  )
  const [amountPassedInSec, setAmountPassedInSec] = useState<number>(0)

  useEffect(() => {
    const stateJson = JSON.stringify(state)

    localStorage.setItem('@react-pomodoro:cycle-state-1.0.0', stateJson)
  }, [state])

  const { cycles, activeCycleId } = state

  const activeCycle = state.cycles.find(
    cycle => cycle.id === state.activeCycleId
  )

  function setAmountPassed(amount: number) {
    setAmountPassedInSec(amount)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: INewCycleFormData) {
    const newCycle: ICycle = {
      id: Date.now().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: Date.now(),
    }

    dispatch(addNewCycleAction(newCycle))
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        createNewCycle,
        interruptCurrentCycle,
        amountPassedInSec,
        setAmountPassed,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
