"use client"
import { useJournalStore } from "@/store/useJournalStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Trash2, Plus } from "lucide-react"

export function WorkTypeManager() {
  const { workTypes, addWorkType, deleteWorkType } = useJournalStore()
  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")

  const handleAdd = async () => {
    if (name && unit) {
      await addWorkType({ name, unit })
      setName(""); setUnit("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Название" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Ед. изм (м2)" className="w-24" value={unit} onChange={e => setUnit(e.target.value)} />
        <Button onClick={handleAdd} size="icon"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
        {workTypes.map(t => (
          <div key={t.id} className="flex justify-between items-center p-2 px-3 text-sm hover:bg-slate-50">
            <span>{t.name} <span className="text-muted-foreground">({t.unit})</span></span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteWorkType(t.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}