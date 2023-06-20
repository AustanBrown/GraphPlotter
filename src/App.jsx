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
  const [axesPropOpen, setAxesPropOpen] = useState(false);
  const coordinateSystems = [
    {id: 'RECT', name: 'Rectangular'},
    {id: 'DEG', name: 'Trigonometric (Degrees)'},
    {id: 'RAD', name: 'Trigonometric (Radians)'},
  ];

  const [coordSys, setCoordSys] = useState(coordinateSystems[0]);

  console.log(`Co-ordinate system is ${coordSys['id']}`);

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

  const toggleAxesOpenProp = () =>
  {
    setAxesPropOpen(!axesPropOpen);
  }

  const closeAxesProp = () => 
  {
    setAxesPropOpen(false);
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
      <Grid equations={equations} domain={domain} range={range} axesToggleHandler={toggleAxesOpenProp} axesMode={coordSys}/>
      {graphPropOpen === true && <GraphProperties equationHandler={handleAddEquation} closeHandler={closeGraphProp}/>}
      {axesPropOpen === true && <AxesProperties closeHandler={closeAxesProp} minDomain={domain[0]} maxDomain={domain[1]} minRange={range[0]} maxRange={range[1]} modifyDomain={(minX, maxX) => setDomain([minX, maxX])} modifyRange={(minY, maxY) => setRange([minY, maxY])} modes={coordinateSystems} setDefaultMode={(tmpMode) => setCoordSys(tmpMode)} defaultMode={coordSys}/>}
    </div>
  );
}

export default App;
