import { fetchClientes } from "@/redux/clientes/fetch";
import type { RootState } from "@/redux/root-reducer";
import type { AppDispatch } from "@/redux/store";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AuthInitializerProps {
  children: ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, clienteAtual, status } = useSelector((state: RootState) => state.clienteReducer);

  useEffect(() => {
    if (token && status === 'not_loaded') {
      dispatch(fetchClientes());
    }
  }, [token, status, dispatch]);

  if (token && !clienteAtual && status !== 'loaded') {
    return null;
  }

  return <>{children}</>;
};
