"use client"

import { useEffect, useState } from "react"
import { useJournalStore } from "@/store/useJournalStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddLogForm } from "@/components/AddLogForm"
import { Trash2, Plus, HardHat, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function JournalPage() {
  const { logs, fetchLogs, fetchWorkTypes, deleteLog, isLoading } = useJournalStore()
  const [dateFilter, setDateFilter] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)


  useEffect(() => {
    fetchLogs(dateFilter)
    fetchWorkTypes()
  }, [dateFilter, fetchLogs, fetchWorkTypes])

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <HardHat className="text-yellow-500 w-8 h-8" /> 
            Журнал работ
          </h1>
          <p className="text-muted-foreground mt-1">Фиксация ежедневного прогресса на объекте</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9 bg-white"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Добавить запись
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Новая запись в журнале</DialogTitle>
              </DialogHeader>
              <AddLogForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>


      <div className="rounded-xl border bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold">Дата</TableHead>
                <TableHead className="font-semibold">Вид работ</TableHead>
                <TableHead className="font-semibold">Объем</TableHead>
                <TableHead className="font-semibold">Исполнитель</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {logs.map((log) => (
                    <motion.tr
                      key={log.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="whitespace-nowrap">
                        {new Date(log.work_date).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">
                          {log.work_type_details?.name || "Не указан"}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">
                          {log.work_type_details?.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <span className="font-bold">{log.volume}</span> {log.work_type_details?.unit}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {log.executor}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            if(confirm("Удалить эту запись?")) deleteLog(log.id)
                          }}
                          className="text-destructive hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && logs.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-slate-400 mb-2">¯\_(ツ)_/¯</div>
            <p className="text-muted-foreground">На эту дату записей нет</p>
            <Button 
              variant="link" 
              onClick={() => setDateFilter("")}
              className="text-blue-500"
            >
              Сбросить фильтр
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}