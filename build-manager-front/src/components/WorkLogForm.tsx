"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useJournalStore } from "@/store/useJournalStore"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader2 } from "lucide-react"

const itemSchema = z.object({
  work_date: z.string().min(1, "Дата"),
  work_type: z.string().min(1, "Вид работ"),
  volume: z.string().min(1, "Объем"),
  executor: z.string().min(2, "ФИО"),
})

const formSchema = z.object({
  items: z.array(itemSchema)
})

export function WorkLogForm({ editData, onSuccess }: { editData?: any, onSuccess: () => void }) {
  const { workTypes, addLog, updateLog } = useJournalStore()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: editData ? [editData] : [{ work_date: new Date().toISOString().split('T')[0], work_type: "", volume: "", executor: "" }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      if (editData) {
        // Редактирование
        await updateLog(editData.id, {
          ...values.items[0],
          work_type: parseInt(values.items[0].work_type)
        })
      } else {
        for (const item of values.items) {
          await addLog({ ...item, work_type: parseInt(item.work_type) })
        }
      }
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-h-[60vh] overflow-y-auto px-1 space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="relative p-4 border rounded-lg bg-slate-50/50 space-y-4">
              {fields.length > 1 && (
                <Button 
                  type="button" variant="ghost" size="icon" 
                  className="absolute -top-2 -right-2 bg-white border shadow-sm rounded-full"
                  onClick={() => remove(index)}
                ><Trash2 className="h-3 w-3 text-destructive" /></Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`items.${index}.work_date`} render={({ field }) => (
                  <FormItem><FormLabel>Дата</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name={`items.${index}.executor`} render={({ field }) => (
                  <FormItem><FormLabel>Исполнитель</FormLabel><FormControl><Input placeholder="ФИО" {...field} /></FormControl></FormItem>
                )}/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField control={form.control} name={`items.${index}.work_type`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вид работы</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Выберите вид работ" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {workTypes.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name} ({t.unit})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name={`items.${index}.volume`} render={({ field }) => (
                  <FormItem><FormLabel>Объем</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>
                )}/>
              </div>
            </div>
          ))}
        </div>

        {!editData && (
          <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => append({ work_date: new Date().toISOString().split('T')[0], work_type: "", volume: "", executor: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Добавить еще одну строку
          </Button>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          {editData ? "Сохранить изменения" : "Сохранить всё в журнал"}
        </Button>
      </form>
    </Form>
  )
}