"use client"



import { useState } from "react"
import { X, AlertTriangle, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function TicketForm({ onClose, onSubmit, clientName, clientEmail }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("media")
  const [department, setDepartment] = useState("soporte")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      priority,
      department,
      clientName,
      clientEmail,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Crear Ticket</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="client" className="block text-sm font-medium mb-1">
                Cliente
              </label>
              <Input id="client" value={clientName} disabled className="bg-gray-50" />
              <p className="text-xs text-muted-foreground mt-1">{clientEmail}</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Título del Ticket *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Problema con el pedido #12345"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descripción *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el problema o solicitud..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                required
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Prioridad *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={priority === "baja" ? "default" : "outline"}
                  className={`flex items-center justify-center ${priority === "baja" ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={() => setPriority("baja")}
                >
                  <Check size={16} className="mr-1" />
                  Baja
                </Button>
                <Button
                  type="button"
                  variant={priority === "media" ? "default" : "outline"}
                  className={`flex items-center justify-center ${priority === "media" ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                  onClick={() => setPriority("media")}
                >
                  <AlertCircle size={16} className="mr-1" />
                  Media
                </Button>
                <Button
                  type="button"
                  variant={priority === "alta" ? "default" : "outline"}
                  className={`flex items-center justify-center ${priority === "alta" ? "bg-red-600 hover:bg-red-700" : ""}`}
                  onClick={() => setPriority("alta")}
                >
                  <AlertTriangle size={16} className="mr-1" />
                  Alta
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1">
                Departamento
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="soporte">Soporte Técnico</option>
                <option value="ventas">Ventas</option>
                <option value="facturacion">Facturación</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear Ticket</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

