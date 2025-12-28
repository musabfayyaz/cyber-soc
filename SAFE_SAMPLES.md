
# Safe Demonstration Materials

This document lists the safe, non-malicious samples used in the Mini SOC project for demonstration purposes. These are industry-standard test materials and are completely harmless.

## 1. EICAR Standard Antivirus Test File

The EICAR test file is a string of text that is recognized by antivirus software as a "virus" for testing purposes. It is **not a real virus** and contains no executable code.

### How to Use
1.  Create a new text file named `eicar.com.txt`.
2.  Copy and paste the following 68-byte string into the file:
    ```
    X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*
    ```
3.  Save the file in the `Downloads` folder of the machine running the Mini SOC client.
4.  The client will detect the file and send a `malware_detected` alert to the dashboard.

## 2. Suspicious Process Names

The client agent maintains a hardcoded list of process names that are flagged as "suspicious" for demonstration purposes. The presence of these processes does not necessarily indicate malicious activity in a real-world scenario, but they are included here to simulate detection.

The current list is:
*   `mimikatz.exe`
*   `nc.exe`
*   `netcat.exe`
*   `powershell.exe`

### How to Use
1.  On the machine running the client, start one of the processes from the list.
2.  For example, on Windows, open the Start Menu and type `powershell.exe`.
3.  The client agent will detect the running process and send a `suspicious_process` alert to the dashboard.

## 3. AMTSO Test URLs

The Anti-Malware Testing Standards Organization (AMTSO) provides a set of URLs for testing security products. These are safe to use.

You can use the "Threat Intelligence URL Checker" on the dashboard to test these URLs.

*   **Phishing Page Test**: `http://phishing.test.com`
*   **Malware Download Test**: `http://malware.test.com/download`

### How to Use
1.  Copy one of the URLs above.
2.  On the Mini SOC dashboard, paste the URL into the "Threat Intelligence URL Checker" and click "Check".
3.  The checker (if configured with a Google Safe Browsing API key) should identify the URL as a threat.
4.  Alternatively, use the "Block URL" remote action to send one of these URLs to a client to test the blocking feature.
