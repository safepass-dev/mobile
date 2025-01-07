   # Safepass Mobile Application
   Video url: [Google Drive](https://drive.google.com/file/d/1ivcxajOAKl2XzJ6nKFHUZVWLGQKpImji/view?usp=sharing)

Welcome to **Safepass**, a comprehensive and user-friendly mobile application designed to enhance your digital security. This application provides a robust platform for securely managing sensitive information, leveraging advanced features like motion sensors, secure storage, and network monitoring. Below, you'll find an overview of the application's core functionalities and technical design.

## Features Overview

### 1. **Secure Storage**

- **Basic Data Storage**: Utilizes `SharedPreferences` (on Android) to store sensitive data such as the user's secret key securely.
- **Local Database**:
  - Uses `Room` for Android and `CoreData` or `Document` storage for iOS.
  - Securely saves user credentials, including JWT tokens and user information, ensuring easy and safe access to user data after login.

### 2. **User Interface**

- Built using **React Native** and **React Native Paper UI Library** providing a seamless and responsive user experience across both Android and iOS platforms.
- Elegant and intuitive UI for effortless navigation and interaction.

### 3. **Background Processing**

- Implements a **Clipboard Timer**: Monitors clipboard content and automatically clears copied passwords after a predefined duration, preventing unintentional exposure of sensitive data.

### 4. **Event Handling**

- **Session Termination on Shutdown**:
  - Leverages **Broadcast Receivers** (Android) and **NSNotificationCenter** (iOS) to detect when the device is shutting down, ensuring the user's session is securely terminated.

### 5. **Sensor Integration**

- Integrates with the **Motion Sensor** to monitor the device's movement:
  - If the device experiences rapid motion (e.g., being shaken), the app detects the activity and automatically logs out the user to prevent unauthorized access.

### 6. **Connectivity Monitoring**

- Actively checks the device's **WiFi connectivity**:
  - Alerts the user if the device is connected to an unsecured or public WiFi network, emphasizing potential security risks.

---

---

## Installation

### Prerequisites

- Node.js and npm/yarn
- Expo CLI
- Android Studio / Xcode for native builds

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/safepass-dev/mobile.git
   ```
2. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```
3. Run the application:
   **currently only works on android devices**
   
   - For Android:
     ```bash
     npx expo run:android
     ```
   - For iOS:
     ```bash
     npx expo run:ios
     ```

---

## Usage

1. Launch the application.
2. Log in with your credentials.
3. Manage your sensitive data securely using the vault interface.
4. Monitor clipboard content and WiFi network status.
5. Stay protected with automatic logout features triggered by device motion or shutdown events.

---

---

## Support

---

Thank you for choosing Safe for your digital security needs!

