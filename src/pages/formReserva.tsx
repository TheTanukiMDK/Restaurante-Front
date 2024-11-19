import React from 'react'
import Header from '@/components/ui/header'
import { Calendar, Clock, Users, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Navbar from '@/components/ui/components_Navbar'

interface Reservation {
    id: number
    name: string
    date: string
    time: string
    guests: number
    tableNumber: number
}

function FormReserva() {
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-[#FAB677] p-4">

                <form className="flex flex-col space-y-4 max-w-xl w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
                    <h1 className='text-3xl font-bold text-center'>Haz tu reserva</h1>
                    <div>
                        {/*<Label htmlFor="name" className="mb-1 text-sm font-semibold text-gray-700">Nombre</Label>*/}
                        <Input id="name" type="hidden" placeholder="Ingresa tu nombre" className="w-full" />
                    </div>

                    <div>
                        <Label htmlFor="email" className="mb-1 text-sm font-semibold text-gray-700">Fecha y hora</Label>
                        <Input id="email" type="datetime-local" placeholder="Ingresa tu correo" className="w-full" />
                    </div>

                    <div>
                        <Label htmlFor="password" className="mb-1 text-sm font-semibold text-gray-700">Numero de personas</Label>
                        <Input id="password" type="text" placeholder="Ingresa cantidad de personas" className="w-full" />
                    </div>

                    <Button type="submit" className="w-full bg-[#EC8439] hover:bg-[#EE9D5E] text-white font-bold py-2 rounded-lg">
                        Reservar
                    </Button>
                </form>
            </div>

        </>
    )
}

export default FormReserva
