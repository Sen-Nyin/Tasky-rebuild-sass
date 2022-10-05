'use: strict';

import sprite from './assets/sprite.svg';

// ######################[ VIEW ]####################

export default class View {
  static createEle(...args) {
    const [ele, ...styles] = args;
    const element = document.createElement(ele);
    styles.forEach((style) => element.classList.add(style));
    return element;
  }

  static createSVG(...args) {
    const [icon, ...styles] = args;
    const w3ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(w3ns, 'svg');
    const use = document.createElementNS(w3ns, 'use');
    use.setAttribute('href', `${sprite}#icon-${icon}`);
    styles.forEach((style) => svg.classList.add(style));
    svg.append(use);
    return svg;
  }

  static findEle(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  static findEles(selector) {
    const element = document.querySelectorAll(selector);
    return element;
  }

  static capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static clear = (target) => {
    while (target.firstElementChild) target.firstElementChild.remove();
  };

  constructor() {
    this.header = View.findEle('header');
    this.navContainer = View.findEle('[data-label="nav-container"]');
    this.sidebar = View.findEle('[data-label="nav-list"]');
    this.burgerBtn = View.findEle('[data-label="toggle-navigation"]');

    // ########## [ NEW BUTTONS ]
    this.newProjectBtn = View.findEle('[data-label="add-project-btn"]');
    this.newTaskBtn = View.findEle('[data-label="add-task-btn"]');

    // ########## [ TASK LIST ]
    this.labelTaskListHeading = View.findEle('[data-label="task-list-title"]');
    this.taskList = View.findEle('[data-label="task-list"]');
    this.filterBtn = View.findEle('[data-label="filter-button"]');
    this.filterList = View.findEle('[data-label="filter-list"]');

    // ########## [ PROJECT LIST ]
    this.projectBtn = View.findEle('[data-label="projects-button"]');
    this.projectList = View.findEle('[data-label="project-list"]');

    // ##########[ MODAL ]
    this.modalTitle = View.findEle('[data-label="modal-title"]');
    this.modal = View.findEle('[data-label="modal"]');
    this.form = View.findEle('[data-label="modal-task-form"]');
    this.warning = View.findEle('[data-label="form-warning"]');
  }

  // #################### [ FORM EVALUATION ] ##################

  taskDetails() {
    const title = View.findEle('[data-label="modal-task-title"]');
    const date = View.findEle('[data-label="modal-task-date"]');
    const project = View.findEle('[data-label="modal-task-project"]');
    const priorities = View.findEles('input[name="priority"]');
    const description = View.findEle('[data-label="modal-task-description"]');
    let details;
    let selectedPriority;
    priorities.forEach((priority) => {
      if (priority.checked) {
        selectedPriority = priority.value;
      }
    });
    let warning;
    if (!title.value && !date.value) {
      warning = 'Title and due date are required!';
      title.classList.add('invalid');
      date.classList.add('invalid');
    } else if (!title.value) {
      warning = 'Title is required!';
      title.classList.add('invalid');
      date.classList.remove('invalid');
    } else if (!date.value) {
      warning = 'Date is required!';
      title.classList.remove('invalid');
      date.classList.add('invalid');
    } else if (new Date().toISOString() > new Date(date.value).toISOString()) {
      warning = 'Date cannot be in the past!';
      title.classList.remove('invalid');
      date.classList.add('invalid');
    }
    if (warning) {
      this.warning.textContent = warning;
    } else {
      this.warning.textContent = '';
      details = {
        title: title.value,
        description: description.value || 'No description',
        date: date.value,
        priority: selectedPriority || 'Low',
        project: project.value,
      };
    }
    return details;
  }

  projectDetails() {
    const projectTitle = View.findEle('[data-label="project-title"]');
    let warning;
    if (!projectTitle.value) {
      warning = 'Project title is required';
      projectTitle.classList.add('invalid');
    } else {
      const projects = this.getProjects();
      projects.forEach((project) => {
        if (project.name === projectTitle.value) {
          warning = 'Project already exists. Choose another name';
          projectTitle.classList.add('invalid');
        }
      });
    }
    if (warning) {
      this.warning.textContent = warning;
    } else {
      this.warning.textContent = '';
    }
    return projectTitle.value;
  }

  // ####################[ DOM TOGGLES ] ##################
  eventToggleNav = () =>
    this.burgerBtn.addEventListener('click', this.toggleNav);

  eventToggleFilter = () =>
    this.filterBtn.addEventListener('click', this.toggleFilter);

  eventToggleProjects = () =>
    this.projectBtn.addEventListener('click', this.toggleProjects);

  toggleNav = () => this.navContainer.classList.toggle('sidebar-hidden');

  toggleFilter = () => this.filterList.classList.toggle('hidden');

  toggleProjects = () => {
    const expandedIcon = View.findEle('[data-label="expand-icon"]');
    if (this.projectList.hasAttribute('data-visible')) {
      this.projectBtn.setAttribute('aria-expanded', false);
      expandedIcon.setAttribute('href', `${sprite}#icon-expand`);
    } else {
      this.projectBtn.setAttribute('aria-expanded', true);
      expandedIcon.setAttribute('href', `${sprite}#icon-shrink`);
    }
    this.projectList.classList.toggle('hidden');
    this.projectList.toggleAttribute('data-visible');
  };

  // ################## [ DOM INJECTION ] ##################
  displayTasks(tasks) {
    View.clear(this.taskList);
    if (!tasks.length) {
      const message = View.createEle('p', 'tasks-notask-text');
      message.textContent = 'No tasks, go take a walk';
      this.taskList.append(message);
    } else {
      tasks.forEach((task) => {
        const alarmIcon = View.createSVG('alarm', 'icon', 'icon-4');
        const labelIcon = View.createSVG('label', 'icon', 'icon-4');
        const deleteIcon = View.createSVG('delete', 'icon', 'icon-5');
        const editIcon = View.createSVG('edit', 'icon', 'icon-5');
        const taskElement = View.createEle('li', 'tasks-list-item');
        taskElement.dataset.taskid = task.id;
        const detailsElement = View.createEle('details', 'tasks-details');
        const summaryElement = View.createEle('summary', 'tasks-summary');
        if (task.priority === 'High')
          taskElement.classList.add('priority-high');
        if (task.priority === 'Medium')
          taskElement.classList.add('priority-medium');
        if (task.priority === 'Low') taskElement.classList.add('priority-low');
        const taskText = View.createEle('span', 'tasks-list-item-title');
        taskText.textContent = task.task;
        const descriptionText = View.createEle(
          'p',
          'tasks-list-item-description'
        );
        descriptionText.textContent = task.description;
        const taskDate = View.createEle('span', 'tasks-list-item-date');
        if (new Date().toISOString() > new Date(task.duedate).toISOString()) {
          const days = Math.round(
            Math.abs(
              (new Date() - new Date(task.duedate)) / (1000 * 60 * 60 * 24)
            )
          );
          taskDate.textContent = `${days} ${days > 1 ? 'days' : 'day'} overdue`;
          if (!task.complete)
            taskDate.classList.add('tasks-list-item-date--overdue');
        } else if (
          new Date().toDateString() === new Date(task.duedate).toDateString()
        ) {
          taskDate.textContent = 'Today!';
        } else {
          const days = Math.round(
            Math.abs(
              (new Date(task.duedate) - new Date()) / (1000 * 60 * 60 * 24)
            )
          );
          if (days === 0) {
            taskDate.textContent = 'Due tomorrow';
          } else {
            taskDate.textContent = task.duedate;
          }
        }
        taskDate.prepend(alarmIcon);
        const taskProject = View.createEle('span', 'tasks-list-item-project');
        taskProject.textContent = task.project;
        taskProject.prepend(labelIcon);
        const checkbox = View.createEle('input', 'tasks-list-item-checkbox');
        checkbox.type = 'checkbox';
        const buttonWrapper = View.createEle(
          'div',
          'tasks-list-item-buttons-wrapper'
        );
        const deleteButton = View.createEle(
          'button',
          'btn',
          'btn-icon-only',
          'btn-tasklist',
          'btn--red'
        );
        deleteButton.append(deleteIcon);
        deleteButton.dataset.label = 'delete-button';
        const editButton = View.createEle(
          'button',
          'btn',
          'btn-icon-only',
          'btn-tasklist',
          'btn--orange'
        );
        editButton.append(editIcon);
        editButton.dataset.label = 'edit-button';
        buttonWrapper.append(editButton, deleteButton);
        if (task.complete) {
          taskElement.classList.add('tasks-complete');
          checkbox.checked = true;
          checkbox.classList.add('tasks-list-item-checkbox-complete');
          taskText.classList.add('tasks-list-item-complete');
          taskDate.textContent = 'Complete';
        }
        summaryElement.append(taskText, buttonWrapper, taskDate, taskProject);
        detailsElement.append(summaryElement, descriptionText);
        taskElement.append(checkbox, detailsElement);
        this.taskList.append(taskElement);
      });
    }
  }

  buildModal = (type, dataArr) => {
    View.clear(this.form);
    const buttonContainer = View.createEle('div', 'modal-button-wrapper');
    buttonContainer.dataset.label = 'form-button-container';
    const closeButton = View.createEle('button', 'btn', 'btn-form', 'btn--red');
    closeButton.dataset.label = 'close-modal';
    closeButton.id = 'close-modal';
    closeButton.textContent = 'Cancel';
    closeButton.type = 'button';
    const submitButton = View.createEle(
      'button',
      'btn',
      'btn-form',
      'btn--green'
    );
    submitButton.type = 'submit';
    submitButton.dataset.label = 'submit';
    submitButton.id = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.dataset.subtype = type;
    if (type === 'task' || type === 'edit') {
      this.modalTitle.textContent = type === 'task' ? 'New Task' : 'Edit Task';
      const taskTitleInput = View.createEle(
        'input',
        'modal-input',
        'modal-task-title'
      );
      taskTitleInput.dataset.label = 'modal-task-title';
      taskTitleInput.type = 'text';
      taskTitleInput.id = 'modal-task-title';
      taskTitleInput.placeholder = 'Task title';
      const taskDescription = View.createEle('textarea', 'modal-task-desc');
      taskDescription.placeholder = 'Task description...';
      taskDescription.dataset.label = 'modal-task-description';
      taskDescription.setAttribute('rows', '6');
      const dateWrapper = View.createEle(
        'fieldset',
        'modal-form-item-wrapper',
        'modal-task-date'
      );
      const taskDueDateInputLabel = View.createEle('label', 'modal-label');
      taskDueDateInputLabel.textContent = 'Due';
      taskDueDateInputLabel.for = 'modal-task-date';
      const taskDueDateInput = View.createEle('input', 'modal-input');
      taskDueDateInput.dataset.label = 'modal-task-date';
      taskDueDateInput.type = 'date';
      taskDueDateInput.id = 'modal-task-date';
      taskDueDateInput.placeholder = 'Due date...';
      dateWrapper.append(taskDueDateInputLabel, taskDueDateInput);
      const projectWrapper = View.createEle(
        'fieldset',
        'modal-form-item-wrapper'
      );
      const taskProjectInputLabel = View.createEle('label', 'modal-label');
      taskProjectInputLabel.textContent = 'Project';
      taskProjectInputLabel.for = 'modal-project-select';
      const taskProjectInput = View.createEle(
        'select',
        'modal-input',
        'modal-task-project'
      );
      taskProjectInput.dataset.label = 'modal-task-project';
      taskProjectInput.id = 'modal-project-select';
      projectWrapper.append(taskProjectInputLabel, taskProjectInput);
      const projects = this.getProjects();
      projects.forEach((project) => {
        const option = View.createEle('option');
        option.value = project.name;
        option.textContent = project.name;
        taskProjectInput.append(option);
        if (this.labelTaskListHeading.textContent === project.name) {
          taskProjectInput.value = project.name;
        }
      });
      const priorityWrapper = View.createEle(
        'fieldset',
        'modal-form-item-wrapper',
        'modal-task-prio'
      );
      const priorityBox = View.createEle('div', 'modal-radio-wrapper');
      const priorityLabel = View.createEle('p', 'modal-label');
      priorityLabel.textContent = 'Priority';
      const labelHighPrio = View.createEle(
        'label',
        'btn',
        'btn-form',
        'btn--red'
      );
      labelHighPrio.setAttribute('for', 'highPrio');
      labelHighPrio.textContent = 'High';
      const radioHighPrio = View.createEle('input', 'modal-radio');
      radioHighPrio.id = 'highPrio';
      radioHighPrio.type = 'radio';
      radioHighPrio.name = 'priority';
      radioHighPrio.value = 'High';
      const labelMediumPrio = View.createEle(
        'label',
        'btn',
        'btn-form',
        'btn--orange'
      );
      labelMediumPrio.setAttribute('for', 'mediumPrio');
      labelMediumPrio.textContent = 'Medium';
      const radioMediumPrio = View.createEle('input', 'modal-radio');
      radioMediumPrio.id = 'mediumPrio';
      radioMediumPrio.type = 'radio';
      radioMediumPrio.name = 'priority';
      radioMediumPrio.value = 'Medium';
      const labelLowPrio = View.createEle(
        'label',
        'btn',
        'btn-form',
        'btn--green'
      );
      labelLowPrio.setAttribute('for', 'lowPrio');
      labelLowPrio.textContent = 'Low';
      const radioLowPrio = View.createEle('input', 'modal-radio');
      radioLowPrio.id = 'lowPrio';
      radioLowPrio.type = 'radio';
      radioLowPrio.name = 'priority';
      radioLowPrio.value = 'Low';
      priorityBox.append(
        radioHighPrio,
        labelHighPrio,
        radioMediumPrio,
        labelMediumPrio,
        radioLowPrio,
        labelLowPrio
      );
      priorityWrapper.append(priorityLabel, priorityBox);
      if (type === 'edit') {
        const [data] = dataArr;
        taskTitleInput.value = data.task;
        taskDueDateInput.value = data.duedate;
        taskProjectInput.value = data.project;
        taskDescription.value = data.description;
        submitButton.dataset.taskid = data.id;
        if (data.priority === 'High') radioHighPrio.checked = true;
        if (data.priority === 'Medium') radioMediumPrio.checked = true;
        if (data.priority === 'Low') radioLowPrio.checked = true;
      }
      this.form.prepend(
        taskTitleInput,
        taskDescription,
        priorityWrapper,
        projectWrapper,
        dateWrapper
      );
    } else if (type === 'project') {
      this.modalTitle.textContent = 'New Project';
      const projectTitle = View.createEle(
        'input',
        'modal-input',
        'modal-project-title'
      );
      projectTitle.dataset.label = 'project-title';
      projectTitle.type = 'text';
      projectTitle.id = 'project-title';
      projectTitle.placeholder = 'Project title...';
      this.form.append(projectTitle);
    }
    buttonContainer.append(closeButton, submitButton);
    this.form.append(buttonContainer);
    this.modal.showModal();
  };

  displayProjects(projects) {
    View.clear(this.projectList);
    projects.forEach((project) => {
      const projectElement = View.createEle('li', 'projects-item');
      const projectName = View.createEle('p');
      projectName.textContent = project.name;
      projectElement.dataset.projectid = project.id;
      projectElement.dataset.label = 'filter';
      projectElement.dataset.filter = project.name;
      projectElement.append(projectName);
      if (project.id > 1) {
        projectElement.dataset.projecttype = 'custom';
        const deleteButton = View.createEle(
          'button',
          'btn',
          'btn-icon-only',
          'btn-project-delete'
        );
        deleteButton.dataset.label = 'delete-button';
        const deleteIcon = View.createSVG('close', 'icon', 'icon-3');
        deleteButton.append(deleteIcon);
        projectElement.append(deleteButton);
      }
      this.projectList.append(projectElement);
    });
  }
  // ###############[ EVENTS ]###############

  eventCloseModal() {
    this.form.addEventListener('click', (e) => {
      const { target } = e;
      if (target.dataset.label === 'close-modal') {
        View.clear(this.form);
        this.modal.close();
        this.warning.textContent = '';
      }
    });
  }

  eventNewTask() {
    this.newTaskBtn.addEventListener('click', () => {
      this.buildModal('task');
    });
  }

  eventNewProject() {
    this.newProjectBtn.addEventListener('click', () => {
      this.buildModal('project');
    });
  }

  eventUpdateLists(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = e.submitter.dataset.subtype;
      if (type === 'task') {
        if (this.taskDetails()) {
          handler(this.taskDetails(), type);
          this.modal.close();
        }
      } else if (type === 'project') {
        if (this.projectDetails()) {
          handler(this.projectDetails(), type);
          this.modal.close();
        }
      } else if (type === 'edit') {
        if (this.taskDetails()) {
          const task = this.taskDetails();
          task.id = Number(e.submitter.dataset.taskid);
          handler(task, type);
          this.modal.close();
        }
      }
    });
  }

  eventClickToEditTask(handler) {
    this.taskList.addEventListener('click', (e) => {
      const { target } = e;
      if (target.closest('button')?.dataset.label === 'edit-button') {
        const id = Number(target.closest('li').dataset.taskid);
        const task = handler(id);
        this.buildModal('edit', task);
      }
    });
  }

  eventDeleteTask(handler) {
    this.taskList.addEventListener('click', (e) => {
      const { target } = e;
      if (target.closest('button')?.dataset.label === 'delete-button') {
        const id = Number(target.closest('li').dataset.taskid);
        handler(id);
      }
    });
  }

  eventCompleteTask(handler) {
    this.taskList.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const id = Number(e.target.parentElement.dataset.taskid);
        handler(id);
      }
    });
  }

  eventDeleteProject(handler) {
    this.projectList.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (button?.dataset.label === 'delete-button') {
        e.stopImmediatePropagation();
        const id = button.closest('li').dataset.projectid;
        handler(Number(id));
        this.labelTaskListHeading.textContent = 'All';
      }
    });
  }

  eventFilter(handler) {
    this.filterList.addEventListener('click', (e) => {
      if (e.target.closest('li')?.dataset.label === 'filter') {
        const { filter } = e.target.closest('li').dataset;
        this.labelTaskListHeading.textContent = View.capitalise(filter);
        handler(filter);
        this.toggleFilter();
      }
    });
    this.projectList.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('li').dataset?.label === 'filter') {
        const { filter } = e.target.closest('li').dataset;
        this.labelTaskListHeading.textContent = View.capitalise(filter);
        handler(filter);
      }
    });
  }
}
