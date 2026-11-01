import React from "react";
import {
    Navigate,Route,Routes,useLocation,useNavigate
} 
from "react-router-dom";
import {
    useAuth
}
from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/auth/Login";
import ParentPage from "./pages/Parent";
import DriverPage from "./pages/Driver";
import CoordinatorPage from "./pages/Coordinator";
import AdminPage from "./pages/Admin";
import {
    ToastProvider,AppShell
}
from "./components/UI";import 
{
    Home,History,AlertTriangle,LayoutDashboard,Route as RouteIcon,Users,Settings,Bus,ClipboardList
}
from "lucide-react";
import {
    startMockEscalation
}
 from "./services/websocket";
import {
    useEffect
} from "react";
const roleHome={parent:"/parent",driver:"/driver",coordinator:"/coordinator",admin:"/admin"};
const navs={coordinator:[{label:"Command centre",to:"/coordinator",icon:LayoutDashboard},{label:"Incidents",to:"/coordinator",icon:AlertTriangle},{label:"Fleet overview",to:"/coordinator",icon:Bus}],admin:[{label:"Overview",to:"/admin",icon:LayoutDashboard},{label:"Routes & stops",to:"/admin/routes",icon:RouteIcon},{label:"Buses & drivers",to:"/admin/fleet",icon:Bus},{label:"User management",to:"/admin/users",icon:Users},{label:"Analytics",to:"/admin/analytics",icon:ClipboardList},{label:"Settings",to:"/admin/settings",icon:Settings}]};
function Shell({children,role}){const {user,logout}=useAuth(),location=useLocation(),nav=useNavigate();const isSide=role==="coordinator"||role==="admin";const items=navs[role];const active=role==="admin"?(location.pathname.split("/")[2]||"overview"):"/coordinator";return <><AppShell user={user} logout={()=>{logout();nav("/login")}} items={isSide?items:null} active={active} onNavigate={to=>{if(role==="admin"&&to.startsWith("/admin/"))nav(to);else nav(to)}}>{children}</AppShell>{!isSide&&<nav className="mobile-bottom-nav">{(role==="parent"?[{to:"/parent",label:"Home",icon:Home},{to:"/parent/history",label:"History",icon:History}]:[{to:"/driver",label:"My route",icon:Bus},{to:"/driver",label:"Report",icon:AlertTriangle}]).map(n=><button key={n.label} className={location.pathname===n.to?"active":""} onClick={()=>nav(n.to)}><n.icon size={19}/><span>{n.label}</span></button>)}</nav>}</>}
function RoleLayout({role,children}){return <ProtectedRoute roles={[role]}><Shell role={role}>{children}</Shell></ProtectedRoute>}
function AdminRoute(){const location=useLocation();return <RoleLayout role="admin"><AdminPage key={location.pathname} initialTab={location.pathname.split("/")[2]}/></RoleLayout>}
export default function App(){useEffect(()=>startMockEscalation(),[]);return <ToastProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/parent" element={<RoleLayout role="parent"><ParentPage/></RoleLayout>}/><Route path="/parent/history" element={<RoleLayout role="parent"><ParentPage historyOnly/></RoleLayout>}/><Route path="/driver" element={<RoleLayout role="driver"><DriverPage/></RoleLayout>}/><Route path="/coordinator/*" element={<RoleLayout role="coordinator"><CoordinatorPage/></RoleLayout>}/><Route path="/admin/*" element={<AdminRoute/>}/><Route path="*" element={<HomeRedirect/>}/></Routes></ToastProvider>}
function HomeRedirect(){const {user}=useAuth();return <Navigate to={user?roleHome[user.role]:"/login"} replace/>}
