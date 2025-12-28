# Mini SOC – Cloud-Based Client–Server Cyber Monitoring System

## Project Introduction
Mini SOC is a semester project for "Introduction to Cyber Security". It simulates a simplified Security Operations Center (SOC) to demonstrate core concepts of cybersecurity monitoring, detection, and response in a client-server architecture. The system consists of a Python-based client agent that runs on user machines and a cloud-deployed, web-based admin portal for centralized visibility and control.

This project is for **educational purposes only** and uses safe, simulated data for demonstration.

## Architecture Overview
The system follows a client-server model:

*   **Client Agent (Python)**: Deployed on endpoint machines, it collects system information (new downloads, suspicious processes), sends it to the server, and awaits remote commands.
*   **Server (Next.js & Node.js)**: A central server that receives data from clients, manages them in real-time using Socket.IO, and serves a web-based dashboard.
*   **Admin Portal (React/Material-UI)**: A futuristic, SOC-style dashboard that provides a centralized view of all connected clients, their activity logs, and allows an admin to execute remote actions.

## Installation & Setup

### Prerequisites
*   Node.js (v18 or later)
*   Python (v3.8 or later)
*   Git

### 1. Server Setup
Clone the repository and navigate to the `server` directory.

```bash
git clone <repository_url>
cd cyber-soc/server
```

Install the dependencies:
```bash
npm install
```

Create a `.env.local` file in the `server` directory and add the following environment variables.

```
# Admin credentials for the dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin

# A random string for session encryption
NEXTAUTH_SECRET=your-super-secret-key

# The base URL of your application
NEXTAUTH_URL=http://localhost:3000

# Google Safe Browsing API Key (Optional)
# Get one from: https://developers.google.com/safe-browsing/v4/get-started
GOOGLE_SAFE_BROWSING_API_KEY=YOUR_API_KEY_HERE
```

### 2. Client Setup
Navigate to the `client` directory.
```bash
cd ../client
```

It is recommended to use a virtual environment for the Python client.
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

## How to Run Client & Server

### 1. Run the Server
Navigate to the `server` directory and run the development server:
```bash
npm run dev
```
The admin portal will be available at `http://localhost:3000`.

### 2. Run the Client
Navigate to the `client` directory and run the client script:
```bash
python client.py
```
The client will connect to the server, and you should see it appear on the dashboard.

## Admin Portal Usage
1.  **Login**: Access the dashboard at `http://localhost:3000` and log in with the admin credentials defined in your `.env.local` file.
2.  **Client List**: On the left, you will see a list of all connected clients.
3.  **Client Selection**: Click on a client to view their specific activity logs and perform actions.
4.  **Dashboard**: The main view shows charts for log levels and an event timeline for the selected client.
5.  **Activity Log**: View real-time logs from the selected client. Logs are color-coded by severity.
6.  **Remote Actions**:
    *   **Send Alert**: Sends a popup message to the client machine.
    *   **Shutdown (Demo)**: Simulates a shutdown command on the client.
    *   **Isolate (Demo)**: Simulates isolating the client machine from the network.
    *   **Block URL (Demo)**: Sends a command to the client to block a specific URL.
7.  **Threat Intelligence**: Use the URL checker to verify if a URL is malicious using the Google Safe Browsing API (requires API key).

## Demonstration Guide

### Demo 1: Client Connection and Log Monitoring
1.  Start the server and a client as described above.
2.  Open the dashboard and log in.
3.  Observe the client appearing in the "Connected Clients" list.
4.  Select the client to view its logs.

### Demo 2: Suspicious Process Detection
1.  On the client machine, open a terminal and run a process with a "suspicious" name. For example, on Windows:
    ```bash
    # PowerShell is in our suspicious list for demo purposes
    powershell.exe
    ```
2.  Observe the dashboard. A new "error" log will appear in the Activity Log, indicating a suspicious process was detected. The pie chart will update to show an increase in errors.

### Demo 3: New Download Detection
1.  On the client machine, create a new file in the `Downloads` folder.
    ```bash
    # On Linux/macOS
touch ~/Downloads/new-file.txt

    # On Windows (in Command Prompt)
echo "test" > %USERPROFILE%\Downloads\new-file.txt
    ```
2.  Observe the dashboard. A new "warn" log will appear, indicating a new file has been downloaded.

### Demo 4: EICAR Malware Detection
1.  Create the EICAR test file in the client's `Downloads` folder. The EICAR string is a safe, standard way to test antivirus software.
    ```
    # Create a file named eicar.com.txt in the Downloads folder
    # and paste the following line into it:
    X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*
    ```
2.  The client will detect the file, and an "error" log will appear on the dashboard with a "malware_detected" type.

### Demo 5: Remote Actions
1.  With a client selected, click the "Send Alert" button. A message box will appear on the client machine.
2.  Click the "Isolate (Demo)" button. An alert will appear on the client machine simulating network isolation.

## Ethical Disclaimer
This project is for educational purposes ONLY. It is designed to demonstrate cybersecurity principles in a controlled, simulated environment. Do not deploy this in a real-world production environment without significant security hardening. The "malware" used is the industry-standard EICAR test string, which is completely harmless.