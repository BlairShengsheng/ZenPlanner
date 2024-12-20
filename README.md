# Zen Planner Flask React Project
Zen Planner is a full-stack productivity application designed to help users stay organized and achieve their goals. The app combines essential productivity tools, such as a to-do list, habit tracker, and daily scheduler, into a seamless and user-friendly interface. Built with Flask on the backend and React-Redux on the frontend, Zen Planner provides a robust and efficient platform for managing tasks, habits, and schedules.

## Index

- [Feature Map](https://github.com/BlairShengsheng/ZenPlanner/wiki/Feature-Planning) 
- [API Endpoint](https://github.com/BlairShengsheng/ZenPlanner/wiki/API-Endpoint)
- [User Stories](https://github.com/BlairShengsheng/ZenPlanner/wiki/User-Stories)
- [Wire Frames](https://github.com/BlairShengsheng/ZenPlanner/wiki/WireFrames)

## Technologies Used
- Frontend: 

    - Built with React and state managed using Redux.
    - Provides a responsive and intuitive interface for task and habit management.
    - Dynamic state updates ensure a smooth user experience.
    - React, Redux, Javascript JSX, CSS

- Backend: 

    - Developed using Flask with SQLAlchemy for database management.
    - Implements RESTful API endpoints for seamless data exchange.
    - Secure user authentication with password hashing and session management.
    - Flask, Python

- Database:
    - Utilizes SQLAlchemy for efficient and secure data storage.
    - Designed to handle complex relationships between tasks, habits, and schedules.

## Features

#### To-Do-List:
##### Logged-in Users can
- User can read/view a to-do-list
- User can create a to-do-list
- User can update a to-do-list
- User can remove a to-do-list

#### Habit:
##### Logged-in Users can
- User can read/view a habit list
- User can create a habit list
- User can update a habit list
- User can remove a habit list

#### TimeBlock:
##### Logged-in Users can
- User can read/view a TimeBlock
- User can create a TimeBlock
- User can update a TimeBlock
- User can remove a TimeBlock

#### Habit Log:
##### Logged-in Users can
- User can read/view a habit log
- User can create a habit log
- User can update a habit log
- User can remove a habit log

## Installation and Setup
1. clone the respository:
    ```bash
    git clone https://github.com/BlairShengsheng/ZenPlanner.git
    ```
2. Set up the backend:
  - install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

  - create a virtual environment:
    ```bash
    pipenv shell
    ```

    ```bash
    flask db upgrade
    ```

    ```bash
    flask seed all
    ```


  - run the Flask server:
    ```bash
    flask run
    ```

3. Set up the frontend:
  - Navigate to the frontend folder:
    ```bash
    cd react-vite
    ```

  - install dependencies:
    ```bash
    npm install
    ```
  
  - Start the React development server:
    ```bash
    npm run dev
    ```

## Future Enhancements
- Integration with external calendar APIs (e.g., Google Calendar).
- Advanced analytics for habit tracking and productivity insights.
- Advanced analytics for habit tracking and productivity insights. 
