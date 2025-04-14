# 📊 Next.js Feature-Rich Table Project

This project showcases a feature-rich data table built with **Next.js** on the frontend and **JSON Server** as a mock backend. It's ideal for demonstrating CRUD operations with a responsive and interactive UI.


## 🧩 Project Structure

- **Backend** – Powered by [JSON Server](https://github.com/typicode/json-server) for a quick RESTful API mock.
- **Frontend** – Built using [Next.js](https://nextjs.org/), a React framework for modern web applications.


## Getting Started

### Backend Setup (JSON Server)

To get the backend up and running:

1. **Navigate to the root folder directory:**
    Open your terminal and move into the project’s root directory for the backend.
    ```cd data-table-app```

2. **Install the required dependencies:**
    Make sure you're using Node.js version 18 or higher. You can check your current version by running:
    ```node -v```

    ### Then, install the dependencies listed in package.json:
    ```npm install```

3. **Start the JSON Server:**
    Once the dependencies are installed, you can start the JSON Server with the following command:
    ```npm run server```

### Frontend Setup – Next.js App
The frontend is built using Next.js and communicates with the JSON Server to display and manipulate tabular data.

## Steps to Run the Frontend:
1. **Navigate to the root folder directory:**
    Open your terminal and move into the project’s root directory for the frontend same as backend.
    ```cd data-table-app```

2. **Switch to the frontend terminal:**
    Open a new terminal window or tab so the backend server keeps running.

    Again, ensure that Node.js version 18 or higher is being used.

3. **Start the Next.js development server:**
    As the dependencies were already installed earlier (npm install was done in the backend step), you can simply start the frontend server with:
    ```npm run dev```

This will launch the Next.js development server, usually at http://localhost:3000. From here, you can interact with the feature-rich table interface.


### Suggestions for Future Improvements
Here are a few enhancements that could significantly improve the overall experience and maintainability of the project:

1. **Add Tooltips for Feedback Messages:**

    Display tooltips or toast messages to provide instant feedback to users for actions like create, update, or delete. This improves the user experience by letting them know whether an action was successful or if something went wrong.

2. **Improve Show/Hide Functionality:**

    Enhance the UI for toggling the visibility of certain elements. This could include using smooth transitions, animations, or better icons to make the UI more interactive and user-friendly.

3. **Add Strict Form Validations:**

    Strengthen input validation in the modal used for adding or editing users. This could include checks for required fields, input formats (like email or number), and length constraints, to prevent invalid data from being submitted.

4. **Upgrade the Backend to a More Robust Solution:**

    While JSON Server is great for prototyping, switching to a more powerful backend framework like Express.js, Koa.js, or Fastify could enable better routing, validation, middleware support, and database integration for real-world production use.




