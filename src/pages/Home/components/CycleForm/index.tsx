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
import { Stop, Play, Alarm } from 'phosphor-react'
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
    userIsAwareOfCycleFinished,
  } = useContext(CycleContext)

  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleValiadationSchema),
    defaultValues: {
      task: activeCycle ? activeCycle.task : '',
      minutes: activeCycle ? activeCycle.minutes : 15,
    },
  })

  const taskValue = watch('task')
  const minutesValue = watch('minutes')

  const isStartButtonDisabled = !taskValue.length || !minutesValue

  function handleUserIsAwareOfCycleFinished() {
    reset()
    userIsAwareOfCycleFinished()
  }

  function handleInterruptCycle() {
    interruptCurrentCycle()
  }

  function handleCreateNewCycle(data: INewCycleFormData) {
    createNewCycle(data)
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
          disabled={!!activeCycle}
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

      {activeCycle && activeCycle.finishedDate && (
        <OKButton type="button" onClick={handleUserIsAwareOfCycleFinished}>
          <Alarm size={24} weight="bold" />
          OK
        </OKButton>
      )}

      {!activeCycle && (
        <StartCountdownButton type="submit" disabled={isStartButtonDisabled}>
          <Play size={24} weight="bold" />
          Start
        </StartCountdownButton>
      )}

      {activeCycle && !activeCycle.finishedDate && (
        <StopCountdownButton type="button" onClick={handleInterruptCycle}>
          <Stop size={24} weight="bold" />
          Stop
        </StopCountdownButton>
      )}
    </FormContainer>
  )
}
