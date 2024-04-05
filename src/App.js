import React from 'react';
import NewGroupButton from './components/group/NewGroupButton';
import GroupService from './services/GroupService';

function App() {
  const handleCrearGrupo = async () => {
    try {
      const groupData = { nombre: 'Ejemplo de Grupo', descripcion: 'Descripción del Grupo' };
      const newGroup = await GroupService.createGroup(groupData);
      console.log('Grupo creado:', newGroup);
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NewGroupButton onClick={handleCrearGrupo} />
      </header>
    </div>
  );
}

export default App;
