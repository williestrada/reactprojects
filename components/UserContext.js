import React from 'react';

const UserContext = React.createContext({
  product: [],
  salesDtl: [],
  isLoading: true,
  modalOpen: false,
  setProduct: () => {},
  setSalesDtl: () => {},
  setLoading: () => {},
  setModalOpen: () => {},
});
export default UserContext;
