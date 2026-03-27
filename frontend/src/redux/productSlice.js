// import { createSlice } from "@reduxjs/toolkit";

// const productSlice = createSlice({
//   name: "product",
//   initialState: {
//   products: [],
//   cart: {
//     items: [],
//     totalPrice: 0
//   },
//   addresses: [],
//   selectedAddress: null
// },
//   reducers: {
//     setProducts: (state, action) => {
//       state.products = action.payload;
//     },
//     setCart: (state, action) => {
//       state.cart = action.payload;
//     },

//     addAddress: (state, action) =>{
//       if(!state.addresses) state.addresses= [] ;
//       state.addresses.push(action.payload)
//     },

//     setSelectedAddress: (state, action) =>{
//       state.selectedAddress = action.payload
//     },

//     deleteAddress: (state, action)=>{
//       state.addresses = state.addresses. filter ((_, index)=>index !== action.payload)
      
//       if(state.selectedAddress === action.payload){
//         state.selectedAddress = null
//       }
//     }

    
//   },
// });

// export const { setProducts , setCart, addAddress , setSelectedAddress , deleteAddress} = productSlice.actions;
// export default productSlice.reducer;





import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
const savedSelectedAddress = JSON.parse(localStorage.getItem("selectedAddress"));

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: {
      items: [],
      totalPrice: 0,
    },
    addresses: savedAddresses,
    selectedAddress: savedSelectedAddress ?? null,
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    addAddress: (state, action) => {
      state.addresses.push(action.payload);

      // Save to localStorage
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;

      // Save selection
      localStorage.setItem("selectedAddress", JSON.stringify(action.payload));
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload
      );

      localStorage.setItem("addresses", JSON.stringify(state.addresses));

      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
        localStorage.removeItem("selectedAddress");
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  addAddress,
  setSelectedAddress,
  deleteAddress,
} = productSlice.actions;

export default productSlice.reducer;