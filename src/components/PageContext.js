import React, { useState } from 'react';

export const myContext = React.createContext();

const Provider = props => {
  const [referringFeature, setReferringFeature] = useState(false);
  const [referringFilter, setReferringFilter] = useState(["munro"]);


  return (
    <myContext.Provider value={{
      referringFeature,
      changeReferringFeature: (e) => setReferringFeature(e),
      referringFilter,
      changeReferringFilter: (e) => setReferringFilter(e),
    }}>
      {props.children}
    </myContext.Provider>
  )
};

export default ({ element }) => (
  <Provider>
    {element}
  </Provider>
);
