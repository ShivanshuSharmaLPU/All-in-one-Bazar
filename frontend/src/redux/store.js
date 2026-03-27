import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
  },
});

export default store;




// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice";
// import productReducer from "./productSlice";
// import addressReducer from "./addressSlice";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     product: productReducer,
//     address: addressReducer,
//   },
// });

// export default store;