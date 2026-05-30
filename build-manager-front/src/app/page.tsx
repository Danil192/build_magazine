"use client"

import { useEffect, useState } from "react"
import { useJournalStore } from "@/store/useJournalStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddLogForm } from "@/components/components/AddLogForm"
import { Trash2, Plus, HardHat, Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function JournalPage() {
  const { logs, fetchLogs, fetchWorkTypes, deleteLog, isLoading } = useJournalStore()
  const [dateFilter, setDateFilter] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    fetchLogs(dateFilter)
    fetchWorkTypes()
  }, [dateFilter])

  return (
    <main className="container mx-auto py-10 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HardHat className="text-yellow-500" /> Журнал работ
          </h1>
          <p className="text-muted-foreground">Учет выполненных работ на объекте</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-8"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Добавить запись
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая запись в журнале</DialogTitle>
              </DialogHeader>
              <AddLogForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Вид работ</TableHead>
              <TableHead>Объем</TableHead>
              <TableHead>Исполнитель</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.tr
                  key={log.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{log.work_date}</TableCell>
                  <TableCell>
                    <div className="font-medium">{log.work_type_details?.name}</div>
                    <div className="text-xs text-muted-foreground">{log.work_type_details?.unit}</div>
                  </TableCell>
                  <TableCell>{log.volume} {log.work_type_details?.unit}</TableCell>
                  <TableCell>{log.executor}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteLog(log.id)}
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {logs.length === 0 && !isLoading && (
          <div className="p-10 text-center text-muted-foreground">
            Записей не найдено. Попробуйте изменить дату или добавить новую работу.
          </div>
        )}
      </div>
    </main>
  )
}