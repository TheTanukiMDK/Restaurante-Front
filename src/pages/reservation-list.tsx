'use client'

import { useState } from 'react'
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

interface Reservation {
  id: number
  name: string
  date: string
  time: string
  guests: number
  tableNumber: number
}

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 1, name: "Juan Pérez", date: "2024-11-15", time: "19:00", guests: 4, tableNumber: 5 },
  { id: 2, name: "María García", date: "2024-11-15", time: "20:30", guests: 2, tableNumber: 2 },
  { id: 3, name: "Carlos Rodríguez", date: "2024-11-16", time: "18:45", guests: 6, tableNumber: 8 },
]

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation)
  }

  const handleUpdateReservation = (updatedReservation: Reservation) => {
    setReservations(reservations.map(res => 
      res.id === updatedReservation.id ? updatedReservation : res
    ))
    setEditingReservation(null)
  }

  const handleDeleteReservation = (id: number) => {
    setReservations(reservations.filter(res => res.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#FAB677] p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#EC8439]">Reservaciones</CardTitle>
          <CardDescription>Gestione las reservaciones del restaurante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.map(reservation => (
              <Card key={reservation.id}>
                <CardHeader>
                  <CardTitle>{reservation.name}</CardTitle>
                  <CardDescription>Mesa {reservation.tableNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Calendar className="text-[#EC8439]" />
                    <span>{reservation.date}</span>
                    <Clock className="text-[#EC8439]" />
                    <span>{reservation.time}</span>
                    <Users className="text-[#EC8439]" />
                    <span>{reservation.guests} personas</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Reservación</DialogTitle>
                        <DialogDescription>
                          Modifique los detalles de la reservación aquí.
                        </DialogDescription>
                      </DialogHeader>
                      {editingReservation && (
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)
                          const updatedReservation: Reservation = {
                            ...editingReservation,
                            name: formData.get('name') as string,
                            date: formData.get('date') as string,
                            time: formData.get('time') as string,
                            guests: parseInt(formData.get('guests') as string),
                            tableNumber: parseInt(formData.get('tableNumber') as string),
                          }
                          handleUpdateReservation(updatedReservation)
                        }}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">Nombre</Label>
                              <Input id="name" name="name" defaultValue={editingReservation.name} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="date" className="text-right">Fecha</Label>
                              <Input id="date" name="date" type="date" defaultValue={editingReservation.date} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="time" className="text-right">Hora</Label>
                              <Input id="time" name="time" type="time" defaultValue={editingReservation.time} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="guests" className="text-right">Personas</Label>
                              <Input id="guests" name="guests" type="number" defaultValue={editingReservation.guests} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tableNumber" className="text-right">Mesa</Label>
                              <Input id="tableNumber" name="tableNumber" type="number" defaultValue={editingReservation.tableNumber} className="col-span-3" />
                            </div>
                            <DialogFooter>
                              <Button type="submit" variant="primary">
                                Actualizar
                              </Button>
                            </DialogFooter>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
