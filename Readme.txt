Backend:=>

jobportal-backend/
│── config/
│   └── db.ts                  # MongoDB connection
│
│── controllers/
│   ├── authController.ts      # Signup/Login
│   └── jobController.ts       # Jobs CRUD + AI description
│
│── middleware/
│   └── authMiddleware.ts      # JWT middleware + role check
│
│── models/
│   ├── User.ts                # User schema
│   └── Job.ts                 # Job schema
│
│── routes/
│   ├── authRoutes.ts          # Auth APIs
│   └── jobRoutes.ts           # Job APIs
│
│── utils/
│   └── generateToken.ts       # (optional) helper for JWT
│
│── server.ts                  # App entrypoint
│── .env                       # Environment variables
│── package.json
│── tsconfig.json





app/
├── candidate/
│   └── dashboard/
│       └── page.tsx            # CandidateDashboard main page
├── login/
│   └── page.tsx                # Login page
├── register/
│   └── page.tsx                # Register page
components/
├── candidate/
│   ├── AvailableJobs.tsx       # Available jobs component
│   ├── MyApplications.tsx      # Applied jobs component
│   ├── SavedJobs.tsx           # Saved jobs component
│   └── Profile.tsx             # Profile page/component
types/
├── index.ts                     # Shared TypeScript types, e.g., Job
public/
├── assets/                      # Images, logos, icons
styles/
├── globals.css                  # Tailwind base + global styles
├── components/                  # Optional component-level CSS
