import axios from "axios";

export const saveCart = async (cart, id) => {
  try {
    const data = await axios.post("/api/user/savecart", {
      cart,
      id,
    });

    return data;
  } catch (error) {
    return error;
  }
};

export const saveAddress = async (address) => {
  try {
    const { data } = await axios.post("/api/user/saveAddress", {
      address,
    });

    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const changeActiveAddress = async (id) => {
  try {
    const { data } = await axios.put("/api/user/manageaddress", {
      id,
    });

    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const deleteAddress = async (id) => {
  try {
    const { data } = await axios.delete(`/api/user/manageaddress/${id}`);

    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const applyCoupon = async (coupon) => {
  try {
    const { data } = await axios.post(`/api/user/applyCoupon/ `, {
      coupon,
    });

    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
