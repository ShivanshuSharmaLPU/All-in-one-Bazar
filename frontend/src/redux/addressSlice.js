import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    selectedAddress: 0,
  },
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    addNewAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
  },
});

export const { setAddresses, addNewAddress, setSelectedAddress } =
  addressSlice.actions;

export default addressSlice.reducer;