import React from 'react';

const UserContext = React.createContext({
  product: [],
  staticData: () => {},
  setProduct: () => {},
});
export default UserContext;
