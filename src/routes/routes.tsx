import Component from "@/pages/table-management";
import ReservationList from "../pages/reservation-list";
import FormReserva from "@/pages/formReserva";
import { createBrowserRouter } from "react-router-dom";

export const rutas = createBrowserRouter([
    {
        path: '/reservas',
        element: <ReservationList></ReservationList>
    },
    {
        path: '/mesas',
        element: <Component></Component>
    },
    {
        path: '/reservaForm',
        element: <FormReserva></FormReserva>
    }

])