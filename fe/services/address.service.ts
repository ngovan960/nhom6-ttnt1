import axiosClient from "../lib/axios";

export const addressService = {
  getMyAddresses: async () => {
    const res = await axiosClient.get('/addresses');
    return res;
  }
};

export default addressService;
