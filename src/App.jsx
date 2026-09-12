import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AxesProperties from './AxesProperties';
import GraphProperties from './GraphProperties';
import Sidebar from './Sidebar';
import Grid from './Grid';

const COORDINATE_SYSTEMS = [
  {id: 'RECT', name: 'Rectangular'},
  {id: 'DEG', name: 'Trigonometric (Degrees)'},
  {id: 'RAD', name: 'Trigonometric (Radians)'},
];

function App()
{
  const [equations, setEquations] = useState([]);
  const [domain, setDomain] = useState([-20, 20]);
  const [range, setRange] = useState([-20, 20]);
  const [graphPropOpen, setGraphPropOpen] = useState(true);
  const [axesPropOpen, setAxesPropOpen] = useState(false);
  const [coordSys, setCoordSys] = useState(COORDINATE_SYSTEMS[0]);

  const openGraphProp = useCallback(() => setGraphPropOpen(true), []);

  const closeGraphProp = useCallback(() => setGraphPropOpen(false), []);

  const toggleAxesOpenProp = useCallback(() => setAxesPropOpen(open => !open), []);

  const closeAxesProp = useCallback(() => setAxesPropOpen(false), []);

  const handleAddEquation = useCallback((newEquation, equationColour) =>
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
  }, [closeGraphProp]);

  const handleRemoveEquation = useCallback(equationID =>
  {
    setEquations(prevEquations => prevEquations.filter(eqn => eqn.id !== equationID));
  }, []);

  const modifyDomain = useCallback((minX, maxX) => setDomain([minX, maxX]), []);

  const modifyRange = useCallback((minY, maxY) => setRange([minY, maxY]), []);

  return (
    <div className="w-screen h-screen grid grid-cols-12">
      <Sidebar equations={equations} addEquationHandler={openGraphProp} removeEquationHandler={handleRemoveEquation}/>
      <Grid equations={equations} domain={domain} range={range} axesToggleHandler={toggleAxesOpenProp} axesMode={coordSys}/>
      {graphPropOpen && <GraphProperties equationHandler={handleAddEquation} closeHandler={closeGraphProp}/>}
      {axesPropOpen && <AxesProperties closeHandler={closeAxesProp} minDomain={domain[0]} maxDomain={domain[1]} minRange={range[0]} maxRange={range[1]} modifyDomain={modifyDomain} modifyRange={modifyRange} modes={COORDINATE_SYSTEMS} setDefaultMode={setCoordSys} defaultMode={coordSys}/>}
    </div>
  );
}

export default App;
