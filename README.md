# Tasky - a ToDo app

Tasky is a ToDo app developed as part of the Fullstack JavaScript path for The Odin Project.

## Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=flat&logo=SASS&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E) ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black)

## About the build

For this project I decided to better understand MVC and implement it. Tasky therefore has 3 classes: Model, View, Controller. The model class handles the data related to the tasks added. The view class handles the visual display presented by the browser. The controller class handles the logic and instructs the view and model classes what to do.

Webpack has been set up with a common config and 2 separate configs - 1 for development and 1 for production. It uses webpback-merge to join the dots. This allowed me to have separate build commands for prod and dev without having to change any settings.

I originally built this project using Tailwind (available in another repo simply named Tasky) but decided to rebuild it using Sass to give me a bit more control.

## Difficulties faced

MVC was difficult to grasp - specifically how the three objects passed functions and information between each other, however I feel that I've got this concept nailed down now in this project.

## User Guide

### Add a task or project

Simply click the Add Task or Add Project buttons. The Add Task button can be found above the main task area. The Add Project button can be found below the project list in the side bar.

### Edit or Delete a task

Each task added has its own buttons for Edit (yellow) and Delete (red).

To edit, click the edit button and make the changes in the modal that appears. Hit submit to save the changes or cancel to abandon.

To delete, click the delete button. This is permanent and instant.

### Delete a project

When you add a project it will be added to the project list in the side bar. To the right of each project name is a delete button represented by a small X. Click this to delete. Deletion is instant.

### Complete a task

Each task in the task list has a checkbox to mark the task as completed.

## Misc Features

- When deleting a project, any tasks added to the project are automatically re-assigned to 'uncategorised'.
- Marking a task as complete sorts it to the bottom of the task list.
- When overdue, instead of the due date, it will show how many days overdue.
- When due today or tomorrow, those words will be displayed instead of the due date.
- The Add New Task modal will by default show whichever project is the current filtered view of the tasklist, in the project selection drop down.
- Cannot add a due date in the past.
- Cannot add a project title that already exists.
- Descriptions can be viewed by clicking the task in the task list - the task expands accordion.

## Images

All icons are from [icomoon](https://icomoon.io/app/#/select).
