// Todas las importaciones deben estar al inicio del archivo.
'use client';

import { useState, useEffect } from 'react';
import { Clock, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/ui/components_Navbar';
import Swal from 'sweetalert2'; // Importación única, al principio
import 'sweetalert2/src/sweetalert2.scss';




interface Reservation {
  id_reservas: number
  id_cliente: number
  id_mesa: number
  fecha_hora: string
  numero_personas_reserva: number
  confirmacion: boolean
}

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reservas')
      const data = await response.json()
      setReservations(data.Reservas)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    }
  }

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation)
  }

  const handleUpdateReservation = async (updatedReservation: Reservation) => {
    try {
      const response = await fetch('http://localhost:3000/api/reservas', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReservation),
      })
      if (response.ok) {
        fetchReservations()
        setEditingReservation(null)
        alert('Éxito: Reservación actualizada correctamente.');
      } else {
        throw new Error('Error al actualizar la reserva')
      }
    } catch (error) {
      console.error('Error al actualizar la reserva:', error)
      alert('Error: No se pudo actualizar la reservación.');
    }
  }

  const handleDeleteReservation = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reservas?id_reservas=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchReservations()
        alert('Reserva eliminada con éxito')
      } else {
        throw new Error('Error al eliminar la reserva')
      }
    } catch (error) {
      console.error('Error al eliminar la reserva:', error)
      alert('Error al eliminar la reserva')
    }
  }

  
  const handleConfirmReservation = async (id_reservas: number) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    swalWithBootstrapButtons
        .fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "No, cancelar",
            reverseButtons: true,
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(
                        `http://localhost:3000/api/reservas`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id_reservas,
                                confirmacion: true, // Cambiar el estado a confirmado
                            }),
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        swalWithBootstrapButtons.fire({
                            title: "¡Confirmado!",
                            text: data.message || "La reserva ha sido confirmada.",
                            icon: "success",
                        });

                        // Opcional: Recargar las reservas después de confirmar
                        fetchReservations(); // Asegúrate de que esta función esté definida en tu componente
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Error desconocido");
                    }
                } catch (error) {
                    console.error("Error al confirmar la reserva:", error);
                    swalWithBootstrapButtons.fire({
                        title: "Error",
                        text: "No se pudo confirmar la reserva.",
                        icon: "error",
                    });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "La reserva no ha sido confirmada.",
                    icon: "error",
                });
            }
        });
};


  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAB677] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#EC8439] mb-2">Reservaciones</h1>
          <p className="text-gray-600 mb-6">Gestione las reservaciones del restaurante</p>
          <div className="space-y-4">
            {reservations.map(reservation => (
              <Card key={reservation.id_reservas} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Cliente ID: {reservation.id_cliente}</h2>
                      <p className="text-gray-500">Mesa {reservation.id_mesa}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">

                        <span>{new Date(reservation.fecha_hora).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#EC8439]" />
                        <span>{new Date(reservation.fecha_hora).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#EC8439]" />
                        <span>{reservation.numero_personas_reserva} personas</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div>
                      <Button
                        onClick={() => handleConfirmReservation(reservation.id_reservas, reservation.id_mesa)}
                        className="bg-green-500 text-white hover:bg-green-600"
                        >
                        Confirmar
                        </Button>

                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-full bg-gray-50 hover:bg-gray-100"
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
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const updatedReservation: Reservation = {
                                  ...editingReservation,
                                  id_cliente: parseInt(formData.get('id_cliente') as string),
                                  id_mesa: parseInt(formData.get('id_mesa') as string),
                                  fecha_hora: formData.get('fecha_hora') as string,
                                  numero_personas_reserva: parseInt(formData.get('numero_personas_reserva') as string),
                                  confirmacion: (formData.get('confirmacion') as string) === 'true',
                                };
                                handleUpdateReservation(updatedReservation);
                              }}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="id_cliente" className="text-right">ID Cliente</Label>
                                    <Input id="id_cliente" name="id_cliente" defaultValue={editingReservation.id_cliente} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="id_mesa" className="text-right">ID Mesa</Label>
                                    <Input id="id_mesa" name="id_mesa" defaultValue={editingReservation.id_mesa} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="fecha_hora" className="text-right">Fecha y Hora</Label>
                                    <Input id="fecha_hora" name="fecha_hora" type="datetime-local" defaultValue={new Date(editingReservation.fecha_hora).toISOString().slice(0, 16)} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="numero_personas_reserva" className="text-right">Personas</Label>
                                    <Input id="numero_personas_reserva" name="numero_personas_reserva" type="number" defaultValue={editingReservation.numero_personas_reserva} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="confirmacion" className="text-right">Confirmación</Label>
                                    <select id="confirmacion" name="confirmacion" defaultValue={editingReservation.confirmacion.toString()} className="col-span-3">
                                      <option value="true">Confirmada</option>
                                      <option value="false">No confirmada</option>
                                    </select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" className="bg-[#EC8439] hover:bg-[#EC8439]/90">
                                    Actualizar
                                  </Button>
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                          onClick={() => handleDeleteReservation(reservation.id_reservas)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                      </div>
                    </div>


                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
