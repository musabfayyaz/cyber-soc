
# Mini SOC - Live Demonstration Guide

This guide provides a step-by-step script for a live demonstration of the Mini SOC project.

## 1. Introduction (30 seconds)
*   "Hello, this is Mini SOC, a project that simulates a Security Operations Center for monitoring and responding to cyber threats on connected devices."
*   "It features a central dashboard that gives us a bird's-eye view of our digital environment and client agents that report back in real-time."
*   "Let's dive in."

## 2. The Dashboard (1 minute)
*   **Show the login screen.** "First, we have a secure login for our security analysts."
*   **Log in.**
*   **Show the main dashboard.** "This is our main dashboard. It's designed to look and feel like a modern SOC, with a dark theme and key information up front."
*   "On the left, we have our list of connected clients. On the right, we have real-time charts and an activity log for the selected client."

## 3. Client Simulation (2 minutes)
*   **Start a new client.** "Now, let's simulate a new employee turning on their computer."
*   Run `python client.py` in a terminal.
*   **Point to the dashboard.** "As you can see, the new client instantly appears on our dashboard. We can see the user's name, hostname, and operating system."
*   **Select the client.** "Let's select this client to drill down into their activity."

## 4. Threat Detection (3 minutes)

### Scenario 1: New Download
*   "Our client agent monitors the Downloads folder. Let's simulate the user downloading a file."
*   Create a new file in the client's `Downloads` folder.
*   **Point to the Activity Log.** "Immediately, a 'warn' event appears in our log, telling us a new file was downloaded. This could be benign, but in a real SOC, it's an event worth noting."

### Scenario 2: Suspicious Process
*   "The agent also monitors for suspicious processes. We have a list of process names that, if seen, will trigger a high-severity alert. For this demo, we've flagged `powershell.exe` as suspicious."
*   Open PowerShell on the client machine.
*   **Point to the dashboard.** "And there it is—a red 'error' alert for a suspicious process. The pie chart for log levels has also updated to reflect this new error."

### Scenario 3: Malware Detection (EICAR)
*   "Now for a more direct threat. Our client can detect signatures of known malware. We'll use the EICAR test file, which is a harmless industry standard for testing antivirus solutions."
*   Create the `eicar.com.txt` file in the `Downloads` folder.
*   **Point to the dashboard.** "The agent detected the EICAR signature, and we have a critical 'malware_detected' alert. This is the kind of event that would trigger an immediate investigation."

## 5. Incident Response (1.5 minutes)
*   "Now that we've detected some threats, let's respond. We have a set of remote actions we can take."
*   **Click "Send Alert".** "We can send a direct alert to the user." A popup appears on the client.
*   **Click "Isolate (Demo)".** "If we believe the machine is compromised, we can isolate it from the network. This is a simulation, but in a real system, this would apply firewall rules to block traffic." An alert appears on the client.
*   **Click "Block URL (Demo)".** "We can also remotely block malicious URLs on the client." Enter a URL when prompted. "The client now has this URL in its blocklist."

## 6. Threat Intelligence (30 seconds)
*   "Finally, the dashboard includes a threat intelligence tool. We can check any URL against the Google Safe Browsing database to see if it's a known threat."
*   Enter a URL (e.g., `google.com`) and click "Check".
*   Show the "No threats found" result.

## 7. Conclusion (30 seconds)
*   "This concludes the demo of Mini SOC. We've seen how it provides centralized monitoring, real-time threat detection, and remote incident response capabilities, all within an educational, simulated environment."
*   "Thank you."
