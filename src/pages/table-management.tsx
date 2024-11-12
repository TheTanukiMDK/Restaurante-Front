'use client'

import { useState } from 'react'
import { Users, Utensils, Clock, Plus } from 'lucide-react'
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

interface Table {
  id: number
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  occupiedSince?: string
}

const INITIAL_TABLES: Table[] = [
  { id: 1, number: 1, capacity: 2, status: 'available' },
  { id: 2, number: 2, capacity: 4, status: 'occupied', occupiedSince: '19:30' },
  { id: 3, number: 3, capacity: 6, status: 'reserved' },
  { id: 4, number: 4, capacity: 4, status: 'available' },
  { id: 5, number: 5, capacity: 8, status: 'occupied', occupiedSince: '20:15' },
  { id: 6, number: 6, capacity: 2, status: 'available' },
]

export default function Component() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const handleTableAction = (action: 'occupy' | 'free' | 'reserve') => {
    if (selectedTable) {
      const updatedTables = tables.map(table => {
        if (table.id === selectedTable.id) {
          switch (action) {
            case 'occupy':
              return { ...table, status: 'occupied', occupiedSince: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            case 'free':
              return { ...table, status: 'available', occupiedSince: undefined }
            case 'reserve':
              return { ...table, status: 'reserved' }
          }
        }
        return table
      })
      setTables(updatedTables)
      setSelectedTable(null)
    }
  }

  const addNewTable = (number: number, capacity: number) => {
    const newTable: Table = {
      id: Math.max(...tables.map(t => t.id)) + 1,
      number,
      capacity,
      status: 'available'
    }
    setTables([...tables, newTable])
  }

  return (
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
                className={`cursor-pointer ${
                  selectedTable?.id === table.id ? 'ring-2 ring-[#EC8439]' : ''
                } ${
                  table.status === 'available' ? 'bg-green-100' :
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
  )
}
