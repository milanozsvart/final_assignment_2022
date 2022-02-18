import {React, useContext, useRef} from 'react'
import { CalculatorContext } from './CalculatorContext'

export default function CalculationTypeToggler(props) {


    const togglerStateRef = useRef()
    const {activeStyle, inactiveStyle, setFormState, setCalulationType, individualStyle, setIndividualStyle, compareStyle, setCompareStyle} = useContext(CalculatorContext)
    const handleCalculationType = (event) => {
        let propertyForChange = event.currentTarget.innerText.toLowerCase()
        setCalulationType(propertyForChange)
        setFormState(0)
        if (togglerStateRef.current.textContent === propertyForChange) {
            setIndividualStyle(activeStyle)
            setCompareStyle(inactiveStyle)
        } else {
            setIndividualStyle(inactiveStyle)
            setCompareStyle(activeStyle)
        }
    }
    return (
        <div id="wrapper-calculator-individual-or-compare">
            <div id="wrapper-individual" className="wrapper-toggler" ref={togglerStateRef} style={individualStyle} onClick={handleCalculationType}>individual</div>
            <div id="wrapper-compare" className="wrapper-toggler" style={compareStyle} onClick={handleCalculationType}>compare</div>
        </div>
    )
}
