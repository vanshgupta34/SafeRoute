// Single API boundary. Replace these imports with Axios requests to Spring Boot when ready.
import axios from "axios";
import * as mock from "../mock/handlers";
export const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||"";
export const http=axios.create({baseURL:API_BASE_URL,timeout:10000});
export const api={
 login:mock.login,parentOverview:mock.parentOverview,getParentAlerts:mock.getParentAlerts,acknowledgeAlert:mock.acknowledgeAlert,
 reportIncident:mock.reportIncident,getCoordinatorData:mock.getCoordinatorData,resolveIncident:mock.resolveIncident,resendIncidentAlert:mock.resendIncidentAlert,
 getAdminData:mock.getAdminData,saveRoutes:mock.saveRoutes,saveBuses:mock.saveBuses,saveParents:mock.saveParents,saveDrivers:mock.saveDrivers,saveSettings:mock.saveSettings
};
