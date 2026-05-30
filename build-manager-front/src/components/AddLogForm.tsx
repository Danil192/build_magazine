"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useJournalStore } from "@/store/useJournalStore"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  work_date: z.string().min(1, "Выберите дату"),
  work_type: z.string().min(1, "Выберите вид работ"),
  volume: z.string().min(1, "Укажите объем"),
  executor: z.string().min(2, "Укажите ФИО исполнителя"),
})

export function AddLogForm({ onSuccess }: { onSuccess: () => void }) {
  const { workTypes, addLog } = useJournalStore()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      work_date: new Date().toISOString().split('T')[0],
      executor: "",
      volume: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addLog({
      ...values,
      work_type: parseInt(values.work_type),
    })
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="work_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="work_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вид работ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name} ({type.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Объем</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="executor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Исполнитель</FormLabel>
                <FormControl><Input placeholder="" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">Сохранить запись</Button>
      </form>
    </Form>
  )
}