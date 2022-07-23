import * as zod from 'zod'
import {
  FormContainer,
  FormHeader,
  MinutesAmountInput,
  OKButton,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { CycleContext } from '../../../../contexts/CycleContext'
import { Stop, Play } from 'phosphor-react'
import { CycleCountdown } from '../CycleCountdown'

export interface INewCycleFormData {
  task: string
  minutes: number
}

const newCycleValiadationSchema = zod.object({
  task: zod.string().min(1).max(255),
  minutes: zod.number().min(1).max(60),
})

export function CycleForm() {
  const {
    activeCycle,
    interruptCurrentCycle,
    createNewCycle,
    isCycleFinished,
    userIsAwareOfCycleFinished,
  } = useContext(CycleContext)

  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleValiadationSchema),
    defaultValues: {
      task: '',
      minutes: 15,
    },
  })

  const taskValue = watch('task')
  const minutesValue = watch('minutes')

  const isStartButtonDisabled = !taskValue.length || !minutesValue

  function handleUserIsAwareOfCycleFinished() {
    userIsAwareOfCycleFinished()
  }

  function handleInterruptCycle() {
    interruptCurrentCycle()
  }

  function handleCreateNewCycle(data: INewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  return (
    <FormContainer
      action="submit"
      onSubmit={handleSubmit(handleCreateNewCycle)}
    >
      <FormHeader>
        <label htmlFor="task">I&apos;m going to work on</label>
        <TaskInput
          id="task"
          type="text"
          placeholder="give a name to your task"
          list="task-suggestions"
          autoComplete="off"
          disabled={!!activeCycle && isCycleFinished}
          {...register('task')}
        />

        <label htmlFor="minutesAmount">For</label>
        <MinutesAmountInput
          id="minutesAmount"
          min={1}
          max={60}
          step={5}
          type="number"
          disabled={!!activeCycle}
          {...register('minutes', { valueAsNumber: true })}
        />
        <span>minutes.</span>
      </FormHeader>

      <CycleCountdown formMinutesData={minutesValue} />

      {!activeCycle && isCycleFinished && (
        <OKButton type="button" onClick={handleUserIsAwareOfCycleFinished}>
          OK
        </OKButton>
      )}

      {!activeCycle && !isCycleFinished && (
        <StartCountdownButton type="submit" disabled={isStartButtonDisabled}>
          <Play size={24} weight="bold" />
          Start
        </StartCountdownButton>
      )}

      {activeCycle && (
        <StopCountdownButton type="button" onClick={handleInterruptCycle}>
          <Stop size={24} weight="bold" />
          Stop
        </StopCountdownButton>
      )}
    </FormContainer>
  )
}
