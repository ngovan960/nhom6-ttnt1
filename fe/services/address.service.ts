import axiosClient from "../lib/axios";

export const addressService = {
  getMyAddresses: async () => {
    const res = await axiosClient.get('/address');
    return res;
  }
};

export default addressService;
