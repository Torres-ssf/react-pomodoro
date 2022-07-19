import { Play, Stop } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  StartCountdownButton,
  HomeContainer,
  FormHeader,
  TaskInput,
  MinutesAmountInput,
  StopCountdownButton,
} from './styles'

import * as zod from 'zod'
import { CycleCountdown } from './components/CycleCountdown'
import { useContext } from 'react'
import { CycleContext } from '../../contexts/CycleContext'

export interface INewCycleFormData {
  task: string
  minutes: number
}

const newCycleValiadationSchema = zod.object({
  task: zod.string().min(1).max(255),
  minutes: zod.number().min(1).max(60),
})

export function Home() {
  const { activeCycle, interruptCurrentCycle, createNewCycle } =
    useContext(CycleContext)

  const { register, handleSubmit, watch } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleValiadationSchema),
    defaultValues: {
      task: '',
      minutes: 5,
    },
  })

  const taskValue = watch('task')
  const minutesValue = watch('minutes')

  const isStartButtonDisabled = !taskValue.length || !minutesValue

  return (
    <HomeContainer>
      <form action="submit" onSubmit={handleSubmit(createNewCycle)}>
        <FormHeader>
          <label htmlFor="task">I&apos;m going to work on</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="give a name to your task"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">For</label>
          <MinutesAmountInput
            id="minutesAmount"
            step={5}
            min={1}
            max={60}
            placeholder="45"
            type="number"
            disabled={!!activeCycle}
            {...register('minutes', { valueAsNumber: true })}
          />
          <span>minutes.</span>
        </FormHeader>

        <CycleCountdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
            <Stop size={24} />
            Stop
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isStartButtonDisabled}>
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
