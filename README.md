# TBE Drive - Cloud File Storage Application

A full-stack web application for secure file storage and management, built with Node.js, Express, PostgreSQL, and Cloudinary.

**Live Demo:** [https://tbe-drive.onrender.com](https://tbe-drive.onrender.com)

## Table of Contents

- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

### Authentication & Security

- User registration and login with session-based authentication
- Password hashing with bcryptjs
- Session persistence using Prisma session store
- Protected routes with authentication middleware
- User-specific data isolation

### File Management

- Upload files to cloud storage (Cloudinary)
- Download files from cloud
- Delete files with cloud cleanup
- File type validation (images, documents, archives, audio, video)
- File size limits (10MB default)
- File metadata tracking (name, size, upload date, owner)

### Folder Organization

- Create, read, update, delete folders
- Organize files within folders
- Folder ownership validation
- Prevents deletion of folders containing files

### User Interface

- Responsive dashboard with real-time statistics
- File and folder listing views
- Detailed file information pages
- Image preview for uploaded images
- Breadcrumb navigation
- Flash messages for user feedback
- Custom 404 and 500 error pages

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **express-validator** - Input validation

### File Storage

- **Cloudinary** - Cloud-based file storage
- **Multer** - Multipart form data handling
- **multer-storage-cloudinary** - Cloudinary integration for Multer

### Frontend

- **EJS** - Templating engine
- **Custom CSS** - Styling

## Prerequisites

Before installation, ensure you have:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Cloudinary account (free tier available)
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TBE-Drive.git
cd TBE-Drive
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uploader_db?schema=public"

# Session
SESSION_SECRET="your-super-secret-session-key-min-32-characters-long"

# Server
PORT=3000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Getting Cloudinary Credentials

1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Paste into `.env` file

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE uploader_db;

# Exit
\q
```

### 2. Run Migrations

```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 3. Verify Database

```bash
# Open Prisma Studio to view database
npx prisma studio --config ./prisma.config.js
```

## Running the Application

### Development Mode

```bash
# With auto-restart on file changes
npm run dev

# Or standard mode
npm start
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
# Set environment
export NODE_ENV=production

# Run application
npm start
```

## Project Structure

```
TBE-Drive/
├── config/
│   ├── cloudinary.js       # Cloudinary configuration
│   ├── multer.js            # File upload configuration
│   └── passport.js          # Authentication strategy
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── dashboardController.js
│   ├── folderController.js  # Folder CRUD operations
│   ├── fileController.js    # File upload/download/delete
│   └── fileDetailController.js
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validators.js        # Input validation rules
│   └── errorHandler.js      # Global error handling
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard routes
│   ├── folders.js           # Folder routes
│   └── files.js             # File routes
├── views/
│   ├── dashboard.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── folders/
│   │   ├── list.ejs
│   │   ├── create.ejs
│   │   ├── edit.ejs
│   │   └── detail.ejs
│   ├── files/
│   │   └── detail.ejs
│   └── errors/
│       ├── 404.ejs
│       └── 500.ejs
├── lib/
│   └── prisma.js            # Prisma client instance
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
├── generated/
│   └── prisma/              # Generated Prisma Client
├── .env                     # Environment variables (not in git)
├── .gitignore
├── index.js                 # Application entry point
├── package.json
└── README.md
```

## API Routes

### Authentication Routes

- `GET /register` - Show registration form
- `POST /register` - Process registration
- `GET /login` - Show login form
- `POST /login` - Process login
- `POST /logout` - Logout user

### Dashboard Routes

- `GET /dashboard` - User dashboard (protected)

### Folder Routes

- `GET /folders` - List all user folders (protected)
- `GET /folders/new` - Show create folder form (protected)
- `POST /folders` - Create new folder (protected)
- `GET /folders/:id` - View folder details (protected)
- `GET /folders/:id/edit` - Show edit folder form (protected)
- `POST /folders/:id/edit` - Update folder (protected)
- `POST /folders/:id/delete` - Delete folder (protected)

### File Routes

- `GET /files/:id` - View file details (protected)
- `POST /folders/:id/upload` - Upload file to folder (protected)
- `GET /files/:id/download` - Download file (protected)
- `POST /files/:id/delete` - Delete file (protected)

## Development Workflow

### Sprint Structure

The project was developed in 4 sprints:

**Sprint 1: Authentication Foundation**

- User registration and login
- Session management
- Protected routes

**Sprint 2: File Management MVP**

- Folder CRUD operations
- Local file upload
- File download and delete

**Sprint 3: Cloud Storage & Validation**

- Cloudinary integration
- File type and size validation
- Enhanced file detail pages
- Error handling

**Sprint 4: Advanced Features** (Optional)

- Nested folders
- Folder sharing
- UI polish

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/ticket-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push and create PR
git push -u origin feature/ticket-name
```

## Testing

### Manual Testing

1. **Authentication Flow**
   - Register new user
   - Login with credentials
   - Access protected routes
   - Logout

2. **Folder Management**
   - Create folder
   - Edit folder name
   - Delete empty folder
   - Try deleting folder with files (should fail)

3. **File Operations**
   - Upload file (check Cloudinary dashboard)
   - Download file
   - View file details
   - Delete file (verify removed from Cloudinary)

4. **Validation**
   - Try uploading file over 10MB
   - Try uploading disallowed file type (.exe)
   - Try uploading allowed file types

5. **Security**
   - Try accessing another user's files
   - Try accessing routes without login

### Database Verification

```bash
# View database in Prisma Studio
npx prisma studio --config ./prisma.config.js

# Check tables: User, Session, Folder, File
```

## Deployment

### Prepare for Deployment

1. Update `.env` for production:

```env
NODE_ENV=production
SESSION_SECRET=generate-strong-random-secret
DATABASE_URL=your-production-database-url
```

2. Set secure cookie flag in `index.js`:

```javascript
cookie: {
  secure: true; // Requires HTTPS
}
```

### Deploy to Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Deploy to Railway

1. Create new project
2. Add PostgreSQL database
3. Connect GitHub repository
4. Add environment variables
5. Deploy automatically on push

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SESSION_SECRET=your-secret
heroku config:set CLOUDINARY_CLOUD_NAME=your-name
heroku config:set CLOUDINARY_API_KEY=your-key
heroku config:set CLOUDINARY_API_SECRET=your-secret

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

## Troubleshooting

### Common Issues

**Issue: Cannot connect to database**

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Check username, password, port, database name
```

**Issue: Prisma Client errors**

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

**Issue: Cloudinary upload fails**

```bash
# Verify credentials in .env
# Check Cloudinary dashboard for API limits
# Ensure file size under limit
```

**Issue: Session not persisting**

```bash
# Check Session table in database
# Verify SESSION_SECRET is set
# Check cookie settings (secure flag)
```

**Issue: File validation errors**

```bash
# Check ALLOWED_FILE_TYPES in config/multer.js
# Verify file MIME type
# Check file size against MAX_FILE_SIZE
```

### Debug Mode

Enable detailed logging:

```javascript
// In index.js, add before routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

## Future Enhancements

### Planned Features (Sprint 4)

- Nested folders (folders within folders)
- Folder sharing with time-limited public links
- File search functionality
- File preview (PDF, video)
- Bulk operations (multi-select delete)
- User profile management
- File versioning
- Trash/restore functionality

### Sprint 5: React Frontend Migration

Migrate from server-side rendered EJS templates to a modern React single-page application.

#### Frontend Architecture

**Technology Stack**

- React 18 with hooks
- React Router for client-side routing
- Axios for API communication
- Context API or Redux for state management
- Tailwind CSS or Material-UI for styling
- React Query for server state management
- Formik or React Hook Form for forms

#### Backend API Transformation

Convert Express application to RESTful API:

**Authentication API**

### Technical Improvements

- Unit and integration tests
- API rate limiting
- Request logging
- Performance monitoring
- Database query optimization
- Caching layer (Redis)
- WebSocket for real-time updates

## License

This project is licensed under the ISC License.

## Author

Built as a learning project for full-stack web development.

## Acknowledgments

- The Odin Project for project inspiration
- Prisma documentation
- Cloudinary documentation
- Express.js community
