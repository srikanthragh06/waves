# Waves

Waves is a social media web app developed using the PERN (PostgreSQL, Express, React, Node.js) stack and socket.io. It provides users with a platform to connect, share updates, and interact with others in a social networking environment.



## Features

- **User Authentication**: Secure sign-up, log-in, and log-out functionalities.
- **Create and Edit Profile**: Users can create profiles, upload, edit, and remove profile pictures, and modify profile details.
- **User Search**: Easily find other users based on their usernames, enabling effortless connections.
- **User Profile Insights**: Access bios, post counts, followers, and following lists of other users.
- **Follow/Unfollow Users**: Control whose posts appear in your feed by following or unfollowing users.
- **Post Management**: Upload, view, like, dislike, comment, and reply to comments on posts.
- **Real-Time Messaging with Media Sharing**: Utilize Socket.IO for instant messaging and share text, posts, images, and videos seamlessly.
- **Infinite Scroll**: Enjoy uninterrupted browsing with infinite scroll and pagination across posts, comments, and messages.

## Installation

To install and run Waves on your local machine, follow these steps:


1. Clone this repository to your local machine:
```bash
  git clone https://github.com/srikanthragh06/waves.git
```

2. Navigate to the `waves` directory:
```bash
  cd waves
```

3. Install dependencies for the frontend, backend, and socket directories:
    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../backend
    npm install

    # Socket
    cd ../socket
    npm install
    ```

You will have to create the neccesary env file in the backend folder

4. Once the dependencies are installed, you can start the development servers for the frontend, backend, and socket:
    ```bash
    # Frontend
    cd ../frontend
    npm start

    # Backend
    cd ../backend
    npm start

    # Socket
    cd ../socket
    npm start
    ```

5. Access Waves in your web browser at `http://localhost:3000`.

That's it! You now have Waves up and running on your local machine.
