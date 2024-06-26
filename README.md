# Blog System

Welcome to the Blog System, a platform designed to share coding knowledge and foster communication among programmers worldwide. This project is built using the MERN stack and deployed on Render.

## Overview

The Blog System allows users to create and share posts, comment on entries, and interact with other users. The platform supports both anonymous and registered users, with additional administrative control for managing content and users.

## Key Features

- **Anonymous Interaction:** Search and view posts, and leave anonymous comments.
- **User Functionality:** Create, edit, and delete posts; like, edit, delete, and reply to comments; view and update profile.
- **Admin Controls:** Delete any post, comment, or user, and view an overview of system activity statistics.
- **Dark and Light Mode:** Toggle between dark and light modes for a comfortable reading experience.
- **Secure Authentication:** Email registration with verification and Google Sign-In support.

## Tech Stack

### Backend:

- **Node.js & Express.js:** Used for developing server-side logic and creating a robust RESTful API.
- **MongoDB & Mongoose:** MongoDB handles the unstructured data storage with Mongoose providing an ODM for easier database interaction.
- **JSON Web Token (JWT):** Employed for secure user authentication and token management.
- **Cookie-parser:** Used to handle and parse cookies, particularly for storing JWT tokens.
- **Nodemailer:** Integrated for sending emails, such as for user registration verification.

### Frontend:

- **React.js:** Provides a dynamic and responsive user interface.
- **React-Redux:** Manages complex state across the application efficiently.
- **Tailwind CSS:** Utilized for utility-first styling, allowing rapid and consistent designs.
- **Flowbite React:** Integrated components to streamline UI development and maintain a cohesive design.
- **Google Firebase:** Used for handling and storing user-uploaded images.

### Deployment:

- **Render:** Chosen for deploying the application due to its seamless and efficient deployment process, ensuring scalability and reliability.

## Conclusion

This blog system exemplifies the versatility and power of the MERN stack in creating a full-fledged web application. With features that cater to both users and admins, and a robust technical foundation, it provides a comprehensive platform for sharing coding knowledge and fostering community interaction.

Feel free to explore the project, suggest improvements, or contribute!