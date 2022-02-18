import {React} from 'react'
import '../../App.css'
import CalculationTypeToggler from './CalculationTypeToggler'
import { CalculatorState } from './CalculatorContext'
import CalculatorForm from './CalculatorForm'

export default function Calculator() {
  return (
    <CalculatorState>
      <CalculationTypeToggler />
      <CalculatorForm/>
    </CalculatorState>
  )
}
