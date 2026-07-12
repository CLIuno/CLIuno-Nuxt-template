export function useTodoApi() {
  const http = useHttp()
  return {
    getAllTodos: () => http.get('/todos'),
    getCurrentUserTodos: () => http.get('/todos/current-user'),
    getTodoById: (id: string) => http.get(`/todos/${id}`),
    createTodo: (data: { title: string; description?: string }) => http.post('/todos', data),
    updateTodo: (id: string, data: Record<string, unknown>) => http.patch(`/todos/${id}`, data),
    deleteTodo: (id: string) => http.delete(`/todos/${id}`),
    toggleTodo: (id: string) => http.patch(`/todos/${id}/toggle`),
  }
}
