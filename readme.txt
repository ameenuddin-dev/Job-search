config=>
👉 Node.js me config folder ka use application ki configuration (DB, JWT, Port, API keys, etc.) ko alag rakhne ke liye hota hai, taaki code clean aur environment-specific settings easy maintain ho sake.

controllers=>
👉 controllers folder ka use hota hai request ka business logic likhne ke liye (CRUD operations, validation, DB calls, JWT generate, etc.).
👉 Routes bas controller function ko call karte hain.

middleware=>
👉 middleware folder ka use hota hai request ko route/controller tak pahunchne se pehle filter/check/modify karne ke liye.

1.Auth check
2.Role check
3.Error handling
4.Logging
5.Validation

models=> or entity
👉 models/ folder ka use MongoDB collections ke schema aur structure define karne ke liye hota hai.
Ye hi backbone hai jisme data store hota hai.

Samajhiye MVC me

M (Model) → Database structure (tables/collections)
V (View) → Frontend (aap Next.js se bana rahe ho)
C (Controller) → Logic (data kaise aayega/jayega)

routes=>
👉 routes/ folder ka use hota hai API ke endpoints define karne ke liye.
Ye bas request ko proper controller function ke paas forward karta hai.


backend/
│
├─ config/
│   └─ db.ts             # MongoDB connection
│
├─ controllers/
│   ├─ authController.ts  # login, signup, logout
│   └─ jobController.ts   # CRUD jobs
│
├─ middleware/
│   └─ authMiddleware.ts  # session verification
│
├─ models/
│   ├─ User.ts            # user schema
│   └─ Job.ts             # job schema
│
├─ routes/
│   ├─ authRoutes.ts      # login, signup, logout endpoints
│   └─ jobRoutes.ts       # job CRUD endpoints
│
├─ server.ts              # express app, session setup
└─ .env                   # MONGO_URI, SESSION_SECRET

comments:
DISABLE_WAYLAND=1 robo3t-snap
