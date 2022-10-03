'use: strict';
import sprite from './assets/sprite.svg';

// ######################[ VIEW ]####################

export default class View {
  constructor() {
    this.header = this.findEle('header');
    this.navContainer = this.findEle('[data-label="nav-container"]');
    this.sidebar = this.findEle('[data-label="nav-list"]');
    this.burgerBtn = this.findEle('[data-label="toggle-navigation"]');

    // ########## [ NEW BUTTONS ]
    this.newProjectBtn = this.findEle('[data-label="add-project-btn"]');
    this.newTaskBtn = this.findEle('[data-label="add-task-btn"]');

    // ########## [ TASK LIST ]
    this.labelTaskListHeading = this.findEle('[data-label="task-list-title"]');
    this.taskList = this.findEle('[data-label="task-list"]');
    this.filterBtn = this.findEle('[data-label="filter-button"]');
    this.filterList = this.findEle('[data-label="filter-list"]');

    // ########## [ PROJECT LIST ]
    this.projectBtn = this.findEle('[data-label="projects-button"]');
    this.projectList = this.findEle('[data-label="project-list"]');

    // ##########[ MODAL ]
    this.modalTitle = this.findEle('[data-label="modal-title"]');
    this.modal = this.findEle('[data-label="modal"]');
    this.form = this.findEle('[data-label="modal-task-form"]');
  }

  // #################### [ FORM EVALUATION ] ##################

  get _taskDetails() {
    const title = this.findEle('[data-label="modal-task-title"]').value;
    const date = this.findEle('[data-label="modal-task-date"]').value;
    const project = this.findEle('[data-label="modal-task-project"]').value;
    const priorities = this.findEles('input[name="priority"]');
    const description = this.findEle(
      '[data-label="modal-task-description"]'
    ).value;
    let selectedPriority;
    priorities.forEach((priority) => {
      if (priority.checked) {
        selectedPriority = priority.value;
      }
    });
    if (title && date) {
      return {
        title: title,
        description: description || 'No description',
        date: date,
        priority: selectedPriority || 'Low',
        project: project,
      };
    }
  }

  get _projectDetails() {
    const projectTitle = this.findEle('[data-label="project-title"]');
    if (projectTitle.value) return projectTitle.value;
  }

  // #################### [ UTILITY FUNCTIONS ] ##################

  createEle(...args) {
    const [ele, ...styles] = args;
    const element = document.createElement(ele);
    styles.forEach((style) => element.classList.add(style));
    return element;
  }
  createSVG(...args) {
    const [icon, ...styles] = args;
    const w3ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(w3ns, 'svg');
    const use = document.createElementNS(w3ns, 'use');
    use.setAttribute('href', `${sprite}#icon-${icon}`);
    styles.forEach((style) => svg.classList.add(style));
    svg.append(use);
    return svg;
  }
  findEle(selector) {
    const element = document.querySelector(selector);
    return element;
  }
  findEles(selector) {
    const element = document.querySelectorAll(selector);
    return element;
  }
  capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    const expandedIcon = this.findEle('[data-label="expand-icon"]');
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

  // ####################[ DOM CLEARING ] ##################
  clear = (target) => {
    while (target.firstElementChild) target.firstElementChild.remove();
  };

  // ################## [ DOM INJECTION ] ##################
  displayTasks(tasks) {
    this.clear(this.taskList);

    if (!tasks.length) {
      const message = this.createEle('p', 'tasks-notask-text');
      message.textContent = 'No tasks, go take a walk';
      this.taskList.append(message);
    } else {
      tasks.forEach((task) => {
        const alarmIcon = this.createSVG('alarm', 'icon', 'icon-4');
        const labelIcon = this.createSVG('label', 'icon', 'icon-4');
        const deleteIcon = this.createSVG('delete', 'icon', 'icon-5');
        const editIcon = this.createSVG('edit', 'icon', 'icon-5');

        const taskElement = this.createEle('li', 'tasks-list-item');
        taskElement.dataset.taskid = task.id;

        const detailsElement = this.createEle('details', 'tasks-details');
        const summaryElement = this.createEle('summary', 'tasks-summary');

        if (task.priority === 'High')
          taskElement.classList.add('priority-high');
        if (task.priority === 'Medium')
          taskElement.classList.add('priority-medium');
        if (task.priority === 'Low') taskElement.classList.add('priority-low');

        const taskText = this.createEle('span', 'tasks-list-item-title');
        taskText.textContent = task.task;

        const descriptionText = this.createEle(
          'p',
          'tasks-list-item-description'
        );
        descriptionText.textContent = task.description;

        const taskDate = this.createEle('span', 'tasks-list-item-date');
        if (new Date().toDateString() > new Date(task.duedate).toDateString()) {
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

        const taskProject = this.createEle('span', 'tasks-list-item-project');
        taskProject.textContent = task.project;
        taskProject.prepend(labelIcon);

        const checkbox = this.createEle('input', 'tasks-list-item-checkbox');
        checkbox.type = 'checkbox';
        const buttonWrapper = this.createEle(
          'div',
          'tasks-list-item-buttons-wrapper'
        );
        const deleteButton = this.createEle(
          'button',
          'btn',
          'btn-icon-only',
          'btn-tasklist',
          'btn--red'
        );
        deleteButton.append(deleteIcon);
        deleteButton.dataset.label = 'delete-button';

        const editButton = this.createEle(
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
    this.clear(this.form);

    const buttonContainer = this.createEle('div', 'modal-button-wrapper');
    buttonContainer.dataset.label = 'form-button-container';

    const closeButton = this.createEle('button', 'btn', 'btn-form', 'btn--red');
    closeButton.dataset.label = 'close-modal';
    closeButton.id = 'close-modal';
    closeButton.textContent = 'Cancel';

    const submitButton = this.createEle(
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

      const taskTitleInput = this.createEle(
        'input',
        'modal-input',
        'modal-task-title'
      );
      taskTitleInput.dataset.label = 'modal-task-title';
      taskTitleInput.type = 'text';
      taskTitleInput.id = 'modal-task-title';
      taskTitleInput.placeholder = 'Task title';
      taskTitleInput.required = true;

      const taskDescription = this.createEle('textarea', 'modal-task-desc');
      taskDescription.placeholder = 'Task description...';
      taskDescription.dataset.label = 'modal-task-description';
      taskDescription.setAttribute('rows', '6');

      const dateWrapper = this.createEle(
        'div',
        'modal-form-item-wrapper',
        'modal-task-date'
      );
      const taskDueDateInputLabel = this.createEle('label', 'modal-label');
      taskDueDateInputLabel.textContent = 'Due';
      taskDueDateInputLabel.for = 'modal-task-date';
      const taskDueDateInput = this.createEle('input', 'modal-input');
      taskDueDateInput.dataset.label = 'modal-task-date';
      taskDueDateInput.type = 'date';
      taskDueDateInput.id = 'modal-task-date';
      taskDueDateInput.required = true;
      dateWrapper.append(taskDueDateInputLabel, taskDueDateInput);

      const projectWrapper = this.createEle('div', 'modal-form-item-wrapper');
      const taskProjectInputLabel = this.createEle('label', 'modal-label');
      taskProjectInputLabel.textContent = 'Project';
      taskProjectInputLabel.for = 'modal-project-select';
      const taskProjectInput = this.createEle(
        'select',
        'modal-input',
        'modal-task-project'
      );
      taskProjectInput.dataset.label = 'modal-task-project';
      taskProjectInput.id = 'modal-project-select';
      projectWrapper.append(taskProjectInputLabel, taskProjectInput);

      const projects = this.getProjects();
      projects.forEach((project) => {
        const option = this.createEle('option');

        option.value = project.name;
        option.textContent = project.name;
        taskProjectInput.append(option);
        if (this.labelTaskListHeading.textContent === project.name) {
          taskProjectInput.value = project.name;
        }
      });

      const priorityWrapper = this.createEle(
        'div',
        'modal-form-item-wrapper',
        'modal-task-prio'
      );
      const priorityBox = this.createEle('div', 'modal-radio-wrapper');
      const priorityLabel = this.createEle('p', 'modal-label');
      priorityLabel.textContent = 'Priority';
      const labelHighPrio = this.createEle(
        'label',
        'btn',
        'btn-form',
        'btn--red'
      );
      labelHighPrio.setAttribute('for', 'highPrio');
      labelHighPrio.textContent = 'High';
      const radioHighPrio = this.createEle('input', 'modal-radio');
      radioHighPrio.id = 'highPrio';
      radioHighPrio.type = 'radio';
      radioHighPrio.name = 'priority';
      radioHighPrio.value = 'High';

      const labelMediumPrio = this.createEle(
        'label',
        'btn',
        'btn-form',
        'btn--orange'
      );
      labelMediumPrio.setAttribute('for', 'mediumPrio');
      labelMediumPrio.textContent = 'Medium';
      const radioMediumPrio = this.createEle('input', 'modal-radio');
      radioMediumPrio.id = 'mediumPrio';
      radioMediumPrio.type = 'radio';
      radioMediumPrio.name = 'priority';
      radioMediumPrio.value = 'Medium';

      const labelLowPrio = this.createEle(
        'label',
        'btn',
        'btn-form',
        'btn--green'
      );
      labelLowPrio.setAttribute('for', 'lowPrio');
      labelLowPrio.textContent = 'Low';
      const radioLowPrio = this.createEle('input', 'modal-radio');
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
        console.log(data);
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
      const projectTitle = this.createEle(
        'input',
        'modal-input',
        'modal-project-title'
      );
      projectTitle.dataset.label = 'project-title';
      projectTitle.type = 'text';
      projectTitle.id = 'project-title';
      projectTitle.placeholder = 'Project title...';
      projectTitle.required = true;
      this.form.append(projectTitle);
    }

    buttonContainer.append(closeButton, submitButton);
    this.form.append(buttonContainer);
    this.modal.showModal();
  };

  displayProjects(projects) {
    this.clear(this.projectList);
    projects.forEach((project) => {
      const projectElement = this.createEle('li', 'projects-item');
      const projectName = this.createEle('p');
      projectName.textContent = project.name;
      projectElement.dataset.projectid = project.id;
      projectElement.dataset.label = 'filter';
      projectElement.dataset.filter = project.name;
      projectElement.append(projectName);
      if (project.id > 1) {
        projectElement.dataset.projecttype = 'custom';
        const deleteButton = this.createEle(
          'button',
          'btn',
          'btn-icon-only',
          'btn-project-delete'
        );
        deleteButton.dataset.label = 'delete-button';
        const deleteIcon = this.createSVG('close', 'icon', 'icon-3');
        deleteButton.append(deleteIcon);
        projectElement.append(deleteButton);
      }
      this.projectList.append(projectElement);
    });
  }
  // ###############[ EVENTS ]###############

  eventCloseModal() {
    this.form.addEventListener('click', (e) => {
      const target = e.target;
      if (target.dataset.label === 'close-modal') {
        this.clear(this.form);
        this.modal.close();
      }
    });
  }
  eventNewTask() {
    this.newTaskBtn.addEventListener('click', (e) => {
      this.buildModal('task');
    });
  }
  eventNewProject() {
    this.newProjectBtn.addEventListener('click', (e) => {
      this.buildModal('project');
    });
  }
  eventUpdateLists(handler) {
    this.form.addEventListener('submit', (e) => {
      const type = e.submitter.dataset.subtype;
      if (type === 'task') {
        if (this._taskDetails) {
          handler(this._taskDetails, type);
        }
      } else if (type === 'project') {
        if (this._projectDetails) {
          handler(this._projectDetails, type);
        }
      } else if (type === 'edit') {
        if (this._taskDetails) {
          const task = this._taskDetails;
          task.id = Number(e.submitter.dataset.taskid);
          handler(task, type);
        }
      }
    });
  }
  eventClickToEditTask(handler) {
    this.taskList.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('button')?.dataset.label === 'edit-button') {
        const id = Number(target.closest('li').dataset.taskid);
        const task = handler(id);
        this.buildModal('edit', task);
      }
    });
  }
  eventDeleteTask(handler) {
    this.taskList.addEventListener('click', (e) => {
      const target = e.target;
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
        const id = button.closest('li').dataset.projectid;
        handler(Number(id));
      }
    });
  }
  eventFilter(handler) {
    this.filterList.addEventListener('click', (e) => {
      if (e.target.closest('li')?.dataset.label === 'filter') {
        const filter = e.target.closest('li').dataset.filter;
        this.labelTaskListHeading.textContent = this.capitalise(filter);
        handler(filter);
        this.toggleFilter();
      }
    });
    this.projectList.addEventListener('click', (e) => {
      if (e.target.closest('li')?.dataset.label === 'filter') {
        const filter = e.target.closest('li').dataset.filter;
        this.labelTaskListHeading.textContent = this.capitalise(filter);
        handler(filter);
      }
    });
  }
}
