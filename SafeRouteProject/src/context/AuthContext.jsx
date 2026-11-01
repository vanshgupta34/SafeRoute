import React,{createContext,useContext,useEffect,useState} from "react";
import {api} from "../services/api";
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("sr-user"))}catch{return null}});const [token,setToken]=useState(()=>localStorage.getItem("sr-token"));
 async function login(credentials){const result=await api.login(credentials);setUser(result.user);setToken(result.token);localStorage.setItem("sr-user",JSON.stringify(result.user));localStorage.setItem("sr-token",result.token);return result.user}
 function logout(){setUser(null);setToken(null);localStorage.removeItem("sr-user");localStorage.removeItem("sr-token")}
 useEffect(()=>{if(!token&&user)setUser(null)},[token]);
 return <AuthContext.Provider value={{user,token,login,logout}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);