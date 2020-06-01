import React from 'react';

const UserContext = React.createContext({
  product: [],
  salesDtl: [],
  isLoading: true,
  modalOpen: false,
  modalEditOpen: false,
  totalSales: 0,
  salesItem: [],
  clearData: true,
  setProduct: () => {},
  setSalesDtl: () => {},
  setLoading: () => {},
  setModalOpen: () => {},
  setModalEditOpen: () => {},
  setSalesItem: () => {},
  setTotalSales: () => {},
  setClearData: () => {},
  csvFileName: '',
  setCsvFileName: () => {},
});
export default UserContext;
