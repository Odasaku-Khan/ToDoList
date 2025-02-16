package main

import (
	"context"
	"encoding/json"
	"os"
)

type Tusk struct {
	ID       int    `json:"id"`
	Text     string `json:"text"`
	Done     bool   `json:"done"`
	Dataa    string `json:"data"`
	Priority string `json:"priority"`
}
type App struct {
	ctx   context.Context
	Tasks []Tusk
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.loadTasks()
	return app
}

func (a *App) loadTasks() {
	file, err := os.ReadFile("task.json")
	if err == nil {
		json.Unmarshal(file, &a.Tasks)
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SaveTasks() {
	file, _ := json.MarshalIndent(a.Tasks, "", " ")
	os.WriteFile("task.json", file, 0644)
}
func (a *App) AddTask(text string, data string, priority string) {
	newTask := Tusk{ID: len(a.Tasks) + 1, Text: text, Done: false, Dataa: data, Priority: priority}
	a.Tasks = append(a.Tasks, newTask)
	a.SaveTasks()
}
func (a *App) DeleteTask(id int) {
	for i, task := range a.Tasks {
		if task.ID == id {
			a.Tasks = append(a.Tasks[:i], a.Tasks[i+1:]...)
			break
		}
	}
	a.SaveTasks()
}
func (a *App) ToggleTask(id int) {
	for i := range a.Tasks {
		if a.Tasks[i].ID == id {
			a.Tasks[i].Done = !a.Tasks[i].Done
			break

		}
	}
	a.SaveTasks()
}
func (a *App) GetTasks() []Tusk {
	return a.Tasks
}
