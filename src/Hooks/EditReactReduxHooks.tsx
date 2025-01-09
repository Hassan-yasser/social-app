import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, GetState } from "../StateManagement/store";

export const useSelectorCustom = useSelector.withTypes<GetState>()
export const useDespatchCostum = useDispatch.withTypes<AppDispatch>()

