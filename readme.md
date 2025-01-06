# SafePass

SafePass is a secure password manager application built with React Native. It provides a user-friendly interface for managing passwords and ensures the security of user data through various features.

## Features

1. **Storage / Basic Data**:

   - Uses `SharedPreferences` to securely store the user's secret key.

2. **Local Database**:

   - Stores JWT token and user information locally after login using SQLite.

3. **UI**:

   - Provides a user interface for users using React Native.

4. **Background Process / Task**:

   - Implements a background timer to clear the clipboard after a password is copied to it.

5. **Broadcast Receiver / NSNotificationCenter**:

   - Logs out the user when the phone is turned off.

6. **Sensor (Motion / Location / Environment)**:

   - Ends the session if the phone is moving rapidly while the app is open.

7. **Connectivity (BLE / Wifi / Cellular Network / USB / NFC)**:
   - Alerts the user if connected to a public or unsecured WiFi network.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- React Native CLI
- Android Studio / Xcode

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/safepass.git
   cd safepass

   ```

2. Install dependencies:
   npm install

# or

yarn install 3. Start the development server:
npm start

# or

yarn start 4. Run the application on your emulator or device:
npm run android

# or

npm run ios
