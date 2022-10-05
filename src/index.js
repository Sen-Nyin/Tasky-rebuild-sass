'use: strict';

// ####################[ IMPORTS ]####################

import './styles.scss';
import Model from './model';
import View from './view';

// ###################[ CONTROLLER ]##################
// Connects user input & logic with display
// @param : model
// @param : view
// ###################################################

class Controller {
  constructor(model, view) {
    this.view = view;
    this.model = model;
    this.view.eventUpdateLists(this.handleUpdateLists);
    this.view.eventDeleteTask(this.handleDeleteTask);
    this.view.eventCompleteTask(this.handleCompleteTask);
    this.view.eventDeleteProject(this.handleDeleteProject);
    this.view.eventClickToEditTask(this.handleGetEditTask);
    this.view.getProjects = this.handleProjectsRequest;
    this.model.eventOnTaskChange(this.onTaskChange);
    this.onTaskChange(this.model.tasks);
    this.model.eventOnProjectChange(this.onProjectChange);
    this.onProjectChange(this.model.projects);
    this.view.eventToggleNav();
    this.view.eventToggleFilter();
    this.view.eventCloseModal();
    this.view.eventNewProject();
    this.view.eventNewTask();
    this.view.eventFilter(this.handleFilterTasks);
    this.view.eventToggleProjects();

    this.filter = 'all';
  }

  onTaskChange = (tasks) => this.view.displayTasks(tasks);

  onProjectChange = (projects) => this.view.displayProjects(projects);

  handleProjectsRequest = () => this.model._projects;

  handleUpdateLists = (item, type) => this.model.updateLists(item, type);

  handleGetEditTask = (id) => this.model.getTaskToEdit(id);

  handleEditTask = (id) => this.model.editTask(id);

  handleDeleteTask = (id) => this.model.deleteTask(id);

  handleCompleteTask = (id) => this.model.completeTask(id);

  handleAddProject = (project) => this.model.addProject(project);

  handleDeleteProject = (id) => this.model.deleteProject(id);

  handleFilterTasks = (filter) => this.model.filterTaskList(filter);
}

// eslint-disable-next-line no-unused-vars
const tasky = new Controller(new Model(), new View());
