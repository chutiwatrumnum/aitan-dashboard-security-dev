import { db } from '../../../utils/firebase'
import { query, collection,onSnapshot, getDocs,where } from 'firebase/firestore'

import { dataAlert, alertDataLists } from '../../../stores/interfaces/alert'
import dayjs from "dayjs";
const getDataSecurityAlert = async () => {
  let allListAlert: dataAlert[] = []
  let countSOSAlert:number=0,countSecurityAlert:number=0,countWarningAlert:number=0
    const resultData: alertDataLists = {
    countHomeAlert: countSecurityAlert,
    countSOSAlert: countSOSAlert,
    countWarningAlert: countWarningAlert,
    allDataAlert: allListAlert
  }
  try {
    
    const querySnapshot = await getDocs(collection(db,"log_alert"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      // console.log(doc.id, " => ", doc.data());
      let datalist = doc.data();
      console.log("dataList:",doc.id,datalist);
      console.log("date:",datalist?.date.split(" "));
     const resultDate=datalist?.date.split(" ")
      let list: dataAlert = {
        id: doc.id,
        lat:datalist?.lat,
        long:datalist?.lng,
        title: datalist?.title,
        fullname: datalist?.fullname,
        address: datalist?.address,
        date: resultDate[0],
        contact_time:resultDate[1],
        status: datalist?.alert == "alarm" ? false : true,
        alertType: datalist?.alertType,
        phone:datalist?.phone
      }

      switch (datalist?.alertType) {
        case "sos":
          countSOSAlert=countSOSAlert+1
          console.log("countSOSAlert:",countSOSAlert);
          
          break;
      case "securityAlert":
        countSecurityAlert=countSecurityAlert+1
        console.log("countSecurityAlert:",countSecurityAlert);
        break;
      case"warning":
        countWarningAlert=countWarningAlert+1
        console.log("countWarningAlert:",countWarningAlert);
        default:
          break;
      }
      allListAlert.push(list)
      resultData.countWarningAlert=countWarningAlert
      resultData.countHomeAlert=countSecurityAlert
      resultData.countSOSAlert=countSOSAlert
     console.log("allListAlert :", allListAlert);
  
    });
  } catch (error) {
    
  }
  return resultData
  }

const getDataAlertLists=async() => {
  const q = query(collection(db, "log_alert"),
  //  where("state", "==", "CA")
   );
  const unsubscribe = await onSnapshot(q, (querySnapshot) => {
 
    querySnapshot.forEach((doc) => {
      let allData=doc.data()
       console.log(" all data:",allData);
       
    });
   
  });
}

  export {getDataSecurityAlert,getDataAlertLists}