import React from 'react';

const UserContext = React.createContext({
  product: [],
  salesDtl: [],
  isLoading: true,
  modalOpen: false,
  modalEditOpen: false,
  salesDataToEdit: [],
  setProduct: () => {},
  setSalesDtl: () => {},
  setLoading: () => {},
  setModalOpen: () => {},
  setModalEditOpen: () => {},
  setSalesDataToEdit: () => {},
});
export default UserContext;
