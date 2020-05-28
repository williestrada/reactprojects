import React from 'react';

const UserContext = React.createContext({
  product: [],
  salesDtl: [],
  isLoading: true,
  modalOpen: false,
  modalEditOpen: false,
  totalSales: 0,
  salesItem: [],
  setProduct: () => {},
  setSalesDtl: () => {},
  setLoading: () => {},
  setModalOpen: () => {},
  setModalEditOpen: () => {},
  setSalesItem: () => {},
  setTotalSales: () => {},
});
export default UserContext;
