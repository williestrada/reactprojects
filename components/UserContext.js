import React from 'react';

const UserContext = React.createContext({
  product: [],
  salesDtl: [],
  isLoading: true,
  modalOpen: false,
  modalEditOpen: false,
  totalSales: 0,
  salesDataToEdit: [],
  setProduct: () => {},
  setSalesDtl: () => {},
  setLoading: () => {},
  setModalOpen: () => {},
  setModalEditOpen: () => {},
  setSalesDataToEdit: () => {},
  setTotalSales: () => {},
});
export default UserContext;
