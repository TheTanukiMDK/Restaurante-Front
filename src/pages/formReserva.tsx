import React, { useState } from "react";
import Navbar from "@/components/ui/components_Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormReserva() {
    const [formData, setFormData] = useState({
        id_cliente: "", // Suponiendo que el cliente tiene un ID
        id_mesa: "", // ID de la mesa seleccionada
        fecha_hora: "",
        numero_personas_reserva: "",
        confirmacion: 1// Por defecto confirmado
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        // Validar campos requeridos
        const { id_cliente, id_mesa, fecha_hora, numero_personas_reserva } = formData;
        if (!id_cliente || !id_mesa || !fecha_hora || !numero_personas_reserva) {
            setMessage("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    numero_personas_reserva: parseInt(formData.numero_personas_reserva),
                    id_cliente: parseInt(formData.id_cliente),
                    id_mesa: parseInt(formData.id_mesa),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al realizar la reserva.");
            }

            const data = await response.json();
            setMessage("Reserva realizada con éxito.");
            console.log(data);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-[#FAB677] p-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-4 max-w-xl w-full mx-auto p-4 bg-white shadow-lg rounded-lg"
                >
                    <h1 className="text-3xl font-bold text-center">Haz tu reserva</h1>
                    {message && <p className="text-center text-red-500">{message}</p>}

                    <div>
                        <Label htmlFor="id_cliente" className="mb-1 text-sm font-semibold text-gray-700">
                            ID Cliente
                        </Label>
                        <Input
                            id="id_cliente"
                            type="text"
                            placeholder="Ingresa tu ID de cliente"
                            className="w-full"
                            value={formData.id_cliente}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="id_mesa" className="mb-1 text-sm font-semibold text-gray-700">
                            ID Mesa
                        </Label>
                        <Input
                            id="id_mesa"
                            type="text"
                            placeholder="Ingresa el ID de la mesa"
                            className="w-full"
                            value={formData.id_mesa}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="fecha_hora" className="mb-1 text-sm font-semibold text-gray-700">
                            Fecha y Hora
                        </Label>
                        <Input
                            id="fecha_hora"
                            type="datetime-local"
                            className="w-full"
                            value={formData.fecha_hora}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="numero_personas_reserva"
                            className="mb-1 text-sm font-semibold text-gray-700"
                        >
                            Número de Personas
                        </Label>
                        <Input
                            id="numero_personas_reserva"
                            type="number"
                            placeholder="Ingresa la cantidad de personas"
                            className="w-full"
                            value={formData.numero_personas_reserva}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#EC8439] hover:bg-[#EE9D5E] text-white font-bold py-2 rounded-lg"
                    >
                        Reservar
                    </Button>
                </form>
            </div>
        </>
    );
}

export default FormReserva;

