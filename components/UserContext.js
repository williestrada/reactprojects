import React from 'react';

const UserContext = React.createContext({
  product: [],
  isLoading: true,
  setProduct: () => {},
  setLoading: () => {},
});
export default UserContext;
