import { differenceInSeconds } from 'date-fns'
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
import { cycleReducer, ICycleState } from '../reducers/cycle/reducer'

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
  const [state, dispatch] = useReducer<typeof cycleReducer, ICycleState>(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: undefined,
    },
    (initialState: ICycleState) => {
      const storedStateJson = localStorage.getItem(
        '@react-pomodoro:cycle-state-1.0.0'
      )

      if (storedStateJson) {
        return JSON.parse(storedStateJson)
      }

      return initialState
    }
  )

  const { cycles, activeCycleId } = state

  const activeCycle = state.cycles.find(
    cycle => cycle.id === state.activeCycleId
  )

  const [amountPassedInSec, setAmountPassedInSec] = useState<number>(() => {
    if (activeCycle) {
      const diffInSec = differenceInSeconds(Date.now(), activeCycle.startDate)

      return diffInSec
    }

    return 0
  })

  useEffect(() => {
    const stateJson = JSON.stringify(state)

    localStorage.setItem('@react-pomodoro:cycle-state-1.0.0', stateJson)
  }, [state])

  function setAmountPassed(amount: number) {
    setAmountPassedInSec(amount)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
    setAmountPassedInSec(0)
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
    setAmountPassedInSec(0)
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
