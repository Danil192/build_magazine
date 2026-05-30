"use client"

import { useEffect, useState } from "react"
import { useJournalStore } from "@/store/useJournalStore"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { WorkLogForm } from "@/components/WorkLogForm"
import { WorkTypeManager } from "@/components/WorkTypeManager"
import { 
  Trash2, 
  Plus, 
  HardHat, 
  Calendar as CalendarIcon, 
  Loader2, 
  Settings2, 
  Edit2 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function JournalPage() {
  const { logs, fetchLogs, fetchWorkTypes, deleteLog, isLoading } = useJournalStore()
  
  // Состояния для управления модальными окнами
  const [dateFilter, setDateFilter] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchLogs(dateFilter)
    fetchWorkTypes()
  }, [dateFilter, fetchLogs, fetchWorkTypes])

  if (!mounted) return null

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      
      {/* ШАПКА */}
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
          <p className="text-muted-foreground mt-1">Система управления строительными проектами</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Фильтр по дате */}
          <div className="relative flex-1 md:flex-none">
            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9 bg-white"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          {/* Кнопка Справочник работ */}
          <Dialog open={isManagerOpen} onOpenChange={setIsManagerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Справочник видов работ">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Справочник видов работ</DialogTitle>
              </DialogHeader>
              <WorkTypeManager />
            </DialogContent>
          </Dialog>

          {/* Кнопка Добавить запись */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" /> Добавить запись
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Внести работы в журнал</DialogTitle>
              </DialogHeader>
              <WorkLogForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ТАБЛИЦА */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[120px]">Дата</TableHead>
                <TableHead>Вид работ</TableHead>
                <TableHead>Объем</TableHead>
                <TableHead>Исполнитель</TableHead>
                <TableHead className="w-[100px] text-right">Действия</TableHead>
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
                      className="group border-b last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap py-4" suppressHydrationWarning>
                        {new Date(log.work_date).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          {log.work_type_details?.name || "Тип не найден"}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          Ед. изм: {log.work_type_details?.unit || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-blue-700">{log.volume}</span> 
                        <span className="ml-1 text-muted-foreground">{log.work_type_details?.unit}</span>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {log.executor}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Редактирование */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setEditingLog({
                              ...log,
                              work_type: log.work_type.toString() // Приводим к строке для Select
                            })}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          {/* Удаление */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-red-50"
                            onClick={() => {
                              if(confirm("Удалить эту запись из журнала?")) deleteLog(log.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && logs.length === 0 && (
          <div className="py-20 text-center bg-slate-50/30">
            <p className="text-muted-foreground">Записей не найдено</p>
            <Button 
              variant="link" 
              onClick={() => setDateFilter("")}
              className="text-blue-600 mt-2"
            >
              Сбросить фильтр по дате
            </Button>
          </div>
        )}
      </div>

      {/* ДИАЛОГ РЕДАКТИРОВАНИЯ */}
      <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактирование записи</DialogTitle>
          </DialogHeader>
          {editingLog && (
            <WorkLogForm 
              editData={editingLog} 
              onSuccess={() => setEditingLog(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

    </main>
  )
}