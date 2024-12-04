import { useState, useEffect } from 'react'
import { Users, Utensils, Clock, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { ImNewTab } from 'react-icons/im'
import Navbar from '@/components/ui/components_Navbar'
import Swal from 'sweetalert2';

interface Table {
  id: number
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  occupiedSince?: string
}

export default function Component() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/mesas')
        const data = await response.json()
        setTables(data.map((mesa: any) => ({
          id: mesa.id,
          number: mesa.numero_mesa,
          capacity: mesa.capacidad_mesa,
          status: mesa.estado_mesa === 1 ? 'available' : mesa.estado_mesa === 2 ? 'occupied' : mesa.estado_mesa === 3 ? 'reserved' : '',
          occupiedSince: mesa.estado_mesa === 2 ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        })))
      } catch (error) {
        console.error("Error al obtener las mesas:", error)
      }
    }
    fetchTables()
  }, [])

  const handleTableAction = async (action: 'occupy' | 'free' | 'reserve') => {
    if (selectedTable) {
      const status = action === 'occupy' ? 2 : action === 'free' ? 1 : action === 'reserve' ? 3 : ''
      const occupiedSince = action === 'occupy' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

      try {
        const response = await fetch(`http://localhost:3000/api/mesas`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado_mesa: status, id: selectedTable.id, occupiedSince }),
        });

        if (response.ok) {
          const updatedTable = await response.json();

          setTables(tables.map(table =>
            table.id === selectedTable.id
              ? { ...table, status: updatedTable.estado_mesa === 1 ? 'available' : updatedTable.estado_mesa === 2 ? 'occupied' : updatedTable.estado_mesa === 3 ? 'reserved' : '' }
              : table
          ));
          setSelectedTable(null);
        } else {
          console.error('Error al actualizar la mesa', response);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    }
  }

  const addNewTable = async (number: number, capacity: number) => {
    const data = {
      numero_mesa: number,
      capacidad_mesa: capacity,
      estado_mesa: 1,
      is_temp: false,
      id_empleado: 1,
    };

    console.log("Datos enviados:", data);

    try {
      const response = await fetch('http://localhost:3000/api/mesas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta:", errorData);
        return;
      }

      const newTable = await response.json();
      setTables((prevTables) => [
        ...prevTables,
        {
          id: newTable.id,
          number: newTable.numero_mesa,
          capacity: newTable.capacidad_mesa,
          status: newTable.estado_mesa === 1 ? 'available' : newTable.estado_mesa === 2 ? 'occupied' : 'reserved',
        },
      ]);

      Swal.fire({
        title: '¡Mesa agregada!',
        text: 'La mesa ha sido agregada con éxito.',
        icon: 'success',
      });

    } catch (error) {
      console.error("Error de red o en la solicitud:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo agregar la mesa.',
        icon: 'error',
      });
    }
  };

  const addTemporaryTable = async (number: number, capacity: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_mesa: number, capacidad_mesa: capacity, is_temp: true }),
      });
      if (response.ok) {
        const newTable = await response.json();
        setTables([...tables, { id: newTable.id, number: newTable.numero_mesa, capacity: newTable.capacidad_mesa, status: 'occupied' }]);
        Swal.fire({
          title: '¡Mesa temporal agregada!',
          text: 'La mesa temporal ha sido agregada con éxito.',
          icon: 'success',
        });
      } else {
        throw new Error('Error al agregar mesa temporal');
      }
    } catch (error) {
      console.error('Error de red:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo agregar la mesa temporal.',
        icon: 'error',
      });
    }
  };

  const updateTable = async (id: number, number: number, capacity: number) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    
    const result = await swalWithBootstrapButtons.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres actualizar esta mesa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/mesas`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            capacidad_mesa: capacity,
            numero_mesa: number,
            estado_mesa: selectedTable?.status === 'available' ? 1 : selectedTable?.status === 'occupied' ? 2 : 3,
            id_empleado: 1,
          }),
        });
        if (response.ok) {
          const updatedTable = await response.json();
          setTables(tables.map(table => (table.id === id ? { ...table, number, capacity } : table)));
          setSelectedTable(null);
          swalWithBootstrapButtons.fire({
            title: "¡Actualizada!",
            text: "La mesa ha sido actualizada con éxito.",
            icon: "success"
          });
        } else {
          throw new Error('Error al actualizar la mesa');
        }
      } catch (error) {
        console.error('Error de red:', error);
        swalWithBootstrapButtons.fire({
          title: "Error",
          text: "No se pudo actualizar la mesa.",
          icon: "error"
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "La actualización de la mesa ha sido cancelada.",
        icon: "error"
      });
    }
  };

  const deleteTable = async (tableId: number) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    const result = await swalWithBootstrapButtons.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la mesa permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/mesas?id=${tableId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          swalWithBootstrapButtons.fire({
            title: "¡Eliminada!",
            text: "La mesa ha sido eliminada con éxito.",
            icon: "success"
          });
          setTables((prevTables) => prevTables.filter((table) => table.id !== tableId));
        } else {
          swalWithBootstrapButtons.fire({
            title: "Error",
            text: "No se pudo eliminar la mesa.",
            icon: "error"
          });
        }
      } catch (error) {
        swalWithBootstrapButtons.fire({
          title: "Error",
          text: "Ocurrió un problema con la solicitud.",
          icon: "error"
        });
        console.error("Error de red:", error);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "La eliminación de la mesa ha sido cancelada.",
        icon: "error"
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAB677] p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#EC8439]">Gestión de Mesas</CardTitle>
            <CardDescription>Administre las mesas del restaurante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map(table => (
                <Card
                  key={table.id}
                  className={`cursor-pointer ${selectedTable?.id === table.id ? 'ring-2 ring-[#EC8439]' : ''
                    } ${table.status === 'available' ? 'bg-green-100' :
                      table.status === 'occupied' ? 'bg-red-100' :
                        'bg-yellow-100'
                    }`}
                  onClick={() => setSelectedTable(table)}
                >
                  <CardHeader>
                    <CardTitle>Mesa {table.number}</CardTitle>
                    <CardDescription>Capacidad: {table.capacity}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {table.status === 'available' ? (
                        <Users className="text-green-500" />
                      ) : table.status === 'occupied' ? (
                        <Utensils className="text-red-500" />
                      ) : (
                        <Clock className="text-yellow-500" />
                      )}
                      <span className="capitalize">{table.status}</span>
                    </div>
                    {table.occupiedSince && (
                      <div className="text-sm text-gray-500 mt-2">
                        Ocupada desde: {table.occupiedSince}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="space-x-2">
              <Button
                onClick={() => handleTableAction('occupy')}
                disabled={!selectedTable || selectedTable.status === 'occupied'}
                className="bg-[#EC8439] hover:bg-[#EE9D5E]"
              >
                Ocupar
              </Button>
              <Button
                onClick={() => handleTableAction('free')}
                disabled={!selectedTable || selectedTable.status === 'available'}
                className="bg-[#EC8439] hover:bg-[#EE9D5E]"
              >
                Liberar
              </Button>
              <Button
                onClick={() => handleTableAction('reserve')}
                disabled={!selectedTable || selectedTable.status === 'reserved'}
                className="bg-[#EC8439] hover:bg-[#EE9D5E]"
              >
                Reservar
              </Button>
              <Button
                onClick={() => selectedTable && deleteTable(selectedTable.id)}
                disabled={!selectedTable}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Eliminar Mesa
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!selectedTable} className="bg-blue-500 hover:bg-blue-600">
                    Actualizar Mesa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Actualizar Mesa</DialogTitle>
                    <DialogDescription>Modifique los datos de la mesa seleccionada.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const number = parseInt(formData.get('number') as string);
                    const capacity = parseInt(formData.get('capacity') as string);
                    if (number && capacity&& selectedTable) {
                      updateTable(selectedTable.id, number, capacity);
                    }
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="number" className="text-right">Número de Mesa</Label>
                        <Input id="number" name="number" type="number" defaultValue={selectedTable?.number} required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">Capacidad</Label>
                        <Input id="capacity" name="capacity" type="number" defaultValue={selectedTable?.capacity} required className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Actualizar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 p-2">
                    Agregar Mesa Temporal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Mesa Temporal</DialogTitle>
                    <DialogDescription>Ingrese los datos para la mesa temporal.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const number = parseInt(formData.get('number') as string);
                    const capacity = parseInt(formData.get('capacity') as string);
                    if (number && capacity) {
                      addTemporaryTable(number, capacity);
                    }
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="number" className="text-right">Número de Mesa</Label>
                        <Input id="number" name="number" type="number" required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">Capacidad</Label>
                        <Input id="capacity" name="capacity" type="number" required className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">Agregar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#EC8439] hover:bg-[#EE9D5E]">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Mesa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Mesa</DialogTitle>
                  <DialogDescription>
                    Ingrese los detalles de la nueva mesa.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const number = parseInt(formData.get('number') as string)
                  const capacity = parseInt(formData.get('capacity') as string)
                  if (number && capacity) {
                    addNewTable(number, capacity)
                  }
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="number" className="text-right">Número de Mesa</Label>
                      <Input id="number" name="number" type="number" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="capacity" className="text-right">Capacidad</Label>
                      <Input id="capacity" name="capacity" type="number" required className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-[#EC8439] hover:bg-[#EE9D5E]">Agregar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

