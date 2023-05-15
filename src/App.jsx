import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AxesProperties from './AxesProperties';
import GraphProperties from './GraphProperties';
import Sidebar from './Sidebar';
import Grid from './Grid';

function App() 
{
  const [equations, setEquations] = useState([]);
  const [domain, setDomain] = useState([-20, 20]);
  const [range, setRange] = useState([-20, 20]);
  const [graphPropOpen, setGraphPropOpen] = useState(true);

  const handleAddEquation = (newEquation, equationColour) =>
  {
    setEquations(prevEquations => [
      ...prevEquations,
      {
        id: uuidv4(),
        equation: newEquation,
        colour: equationColour,
      }
    ]);
    closeGraphProp();
  }

  const openGraphProp = () =>
  {
    setGraphPropOpen(true);
  }

  const closeGraphProp = () =>
  {
    setGraphPropOpen(false);
  }

  const handleRemoveEquation = index =>
  {
    setEquations(prevEquations => prevEquations.filter(eqn => eqn.id !== index));
  }

  const handleUpdateEquation = (index, eqnText) =>
  {
    const currEqnIndex = equations.findIndex(eqn => eqn.id === index);
    const updatedEqn = Object.assign({}, equations[currEqnIndex]);
    updatedEqn.equation = eqnText;

    const updatedEquations = equations.slice();
    updatedEquations[curEqnIndex] = updatedEqn;
    setEquations(updatedEquations);
  }

  return (
    <div className="w-screen h-screen grid grid-cols-12">
      <Sidebar equations={equations} addEquationHandler={openGraphProp} removeEquationHandler={handleRemoveEquation}/>
      <Grid equations={equations} domain={domain} range={range}/>
      {graphPropOpen === true && <GraphProperties equationHandler={handleAddEquation} closeHandler={closeGraphProp}/>}
    </div>
  );
}

export default App;
