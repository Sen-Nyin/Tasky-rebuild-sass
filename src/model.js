'use: strict';

// ######################[ MODEL ]####################

export default class Model {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.projects = JSON.parse(localStorage.getItem('projects')) || [
      { id: 1, name: 'uncategorised' },
    ];
  }

  // eslint-disable-next-line no-underscore-dangle
  get _projects() {
    return this.projects;
  }

  getTaskToEdit(id) {
    const edittask = this.tasks.filter((task) => task.id === id);
    return edittask;
  }

  static compare = (a, b) => {
    if (a.complete > b.complete) return 1;
    if (a.complete < b.complete) return -1;
    return 0;
  };

  filterTaskList(filter) {
    let tasks;
    if (filter === 'all') {
      tasks = this.tasks;
    } else if (filter === 'today') {
      const today = new Date().toDateString();
      tasks = this.tasks.filter(
        (task) => new Date(task.duedate).toDateString() === today
      );
    } else if (filter === 'upcoming') {
      const today = new Date().toDateString();
      tasks = this.tasks.filter(
        (task) => new Date(task.duedate).toDateString() > today
      );
    } else if (filter === 'overdue') {
      const today = new Date().toDateString();
      tasks = this.tasks.filter(
        (task) =>
          today > new Date(task.duedate).toDateString() && !task.complete
      );
    } else if (filter === 'High' || filter === 'Medium' || filter === 'Low') {
      tasks = this.tasks.filter((task) => task.priority === filter);
    } else {
      tasks = this.tasks.filter((task) => task.project === filter);
    }
    tasks.sort(this.compare);
    this.onTaskChange(tasks);
  }

  eventOnTaskChange(handler) {
    this.onTaskChange = handler;
  }

  eventOnProjectChange(handler) {
    this.onProjectChange = handler;
  }

  commitTaskChange(tasks) {
    this.onTaskChange(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  commitProjectChange(projects) {
    this.onProjectChange(projects);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  updateLists(details, type) {
    if (type === 'task') {
      this.addTask(details);
    } else if (type === 'project') {
      this.addProject(details);
    } else if (type === 'edit') {
      this.editTask(details);
    }
  }

  addTask(newTask) {
    const task = {
      id: this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 1,
      task: newTask.title,
      description: newTask.description,
      duedate: newTask.date,
      priority: newTask.priority,
      project: newTask.project,
      complete: false,
    };
    this.tasks.push(task);
    this.commitTaskChange(this.tasks);
  }

  editTask(editedTask) {
    this.tasks = this.tasks.map((task) =>
      task.id === editedTask.id
        ? {
            id: task.id,
            task: editedTask.title,
            description: editedTask.description,
            duedate: editedTask.date,
            priority: editedTask.priority,
            project: editedTask.project,
            complete: task.complete,
          }
        : task
    );
    this.commitTaskChange(this.tasks);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.commitTaskChange(this.tasks);
  }

  completeTask(id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id
        ? {
            id: task.id,
            task: task.task,
            description: task.description,
            duedate: task.duedate,
            priority: task.priority,
            project: task.project,
            complete: !task.complete,
          }
        : task
    );
    this.tasks.sort(this.compare);
    this.commitTaskChange(this.tasks);
  }

  addProject(newProject) {
    const project = {
      id:
        this.projects.length > 0
          ? this.projects[this.projects.length - 1].id + 1
          : 1,
      name: newProject,
    };
    this.projects.push(project);
    this.commitProjectChange(this.projects);
  }

  deleteProject(id) {
    const [toDelete] = this.projects.filter((project) => project.id === id);
    this.tasks = this.tasks.map((task) =>
      task.project === toDelete.name
        ? {
            id: task.id,
            task: task.task,
            description: task.description,
            duedate: task.duedate,
            priority: task.priority,
            project: 'uncategorised',
            complete: task.complete,
          }
        : task
    );
    this.projects = this.projects.filter((project) => project.id !== id);
    this.commitTaskChange(this.tasks);
    this.commitProjectChange(this.projects);
    this.filterTaskList('all');
  }
}
