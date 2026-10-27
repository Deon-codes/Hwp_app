## Running the Frontend Locally

Follow these steps to run ESCAPE on Windows.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your system.
- The ESCAPE project downloaded and extracted locally.

### Steps

**1. Open the project**

Open the ESCAPE project folder in VS Code.

**2. Open the terminal**

Press `` Ctrl + ` `` to open the integrated terminal.

**3. Navigate to the client directory**

Run the following command in PowerShell:

```powershell
cd "C:\Users\Deon Raj\OneDrive\Desktop\Vs_code\hwp\client"
```

Replace the path with your actual project location if it differs.

**4. Start the development server**

Run:

```powershell
npx vite --host 0.0.0.0 --port 3000 --strictPort
```

Wait until Vite reports that the server is ready.

**5. Open ESCAPE in your browser**

Visit:

**http://localhost:3000/**

Keep the terminal open while using the application.

### Troubleshooting

**Port 3000 is already in use**

Another Vite server may already be running. Open [http://localhost:3000/](http://localhost:3000/) in your browser first. If it is not your application, stop the process using that port before restarting the server.

**`npm run dev` fails in PowerShell**

The existing development script uses Unix-style environment-variable syntax, which is not natively supported by Windows PowerShell. Starting Vite directly with the command above bypasses that script.

**Stopping the server**

Press `Ctrl + C` in the terminal running Vite.

### Notes

- This procedure starts the frontend only. Features that depend on a backend or external services may require additional configuration.
- The server runs locally on your machine and is intended for development.
