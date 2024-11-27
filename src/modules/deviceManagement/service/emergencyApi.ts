import axios from "axios";
const callToMember=async(ticketId:number,memberId: number,callSuccess:boolean) =>{
    try {
      const response = await axios.post(`/home-security/call-history/${ticketId}`,{
        "memberId": memberId,
        "callSuccess": callSuccess
      });
      console.log("nextStep2:",response);
      if (response.status===200) {
        return true
      }
      
     
    } catch (error) {
        console.error("API Error:", error);
        return false
      // จัดการ error
    }
  }
const nextStep2=async(ticketId: number,helpStepId:number) =>{
    try {
      const response = await axios.put(`/home-security/next-step/2/${ticketId}`,{
        "helpStepId": helpStepId
      });
      console.log("nextStep2:",response);
      if (response.status===200) {
        return true
      }
      
     
    } catch (error) {
        console.error("API Error:", error);
        return false
      // จัดการ error
    }
  }
const nextStep3=async(ticketId: number) =>{
    try {
      const response = await axios.put(`/home-security/next-step/3/${ticketId}`,{
        "helpComplete": true
      });
      console.log("nextStep3:",response);
      
      if (response.status===200) {
        return true
      }
      
     
    } catch (error) {
        console.error("API Error:", error);
        return false
      // จัดการ error
    }
  }
  const nextStep4=async(ticketId: number,message:string) =>{
    try {
      const response = await axios.put(`/home-security/next-step/4/${ticketId}`,{
        "note": message
      });
      console.log("nextStep4:",response);
      if (response.status===200) {
        return true
      }
      
     
    } catch (error) {
        console.error("API Error:", error);
        return false
      // จัดการ error
    }
  }
  const getTicketList=async() =>{
    try {
      const response = await axios.get(`/home-security/ticket`);
      console.log("getTicketList:",response.data.ticket.id);
      if (response.status===200) {
        return response.data.ticket.id
      }
      
     
    } catch (error) {
        console.error("API Error:", error);
        return 0
      // จัดการ error
    }
  }
  export {nextStep2,nextStep3,nextStep4,callToMember,getTicketList}