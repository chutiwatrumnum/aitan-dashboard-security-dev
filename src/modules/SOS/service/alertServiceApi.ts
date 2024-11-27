import axios from "axios";
import { CreateTicketRequest } from "../../../stores/interfaces/SOS";
const acceptAlertCase=async(data:CreateTicketRequest) =>{
    try {
      const response = await axios.post(`/home-security/create-ticket`,data);
      console.log("acceptAlertCase:",response);
      if (response.status===200) {
        return true
      }
      
     
    } catch (error) {
        console.error("API Error:", error);
        return false
      // จัดการ error
    }
  }

  export {acceptAlertCase}