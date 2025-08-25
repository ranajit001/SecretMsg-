import AuthContext from "./UserContext"
import { useContext } from "react"

export const useAuth = ()=> useContext(AuthContext)