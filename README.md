# Framez — A Social Mobile App Built with React Native & Supabase

Framez is a mobile social platform where users can **share posts**, **view a global feed**, and **manage their profiles** — all in real time.
It’s built with **Expo (React Native)** and **Supabase** for authentication, storage, and database features.

---

##  Features

###  Authentication

* Secure sign-up, login, and logout using Supabase Auth.
* Persistent sessions — users stay logged in after reopening the app.
* Profile creation with **full name and email** stored in the database.

###  Feed

* Real-time feed showing all posts from every user.
* Each post displays:

  * Author’s name
  * Content (text + optional image)
  * Timestamp
  * Like button with live like count ❤️
* Supports pull-to-refresh and automatic real-time updates.

###  Create Post

* Users can create posts with text, images, or both.
* Image uploads are handled through **Supabase Storage**.
* Uploaded images preview instantly before posting.

###  Profile

* Displays logged-in user’s info: name, email, join date.
* Shows all posts created by the current user.
* Users can **delete their own posts** easily.
* Includes a **logout** button.

###  Theming

* Automatic **Dark/Light mode** support using device theme.
* Consistent color palette with Supabase purple `#7c3aed` as the primary tint.

---

##  Tech Stack

| Category   | Technology                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| Framework  | [React Native (Expo SDK 54)](https://expo.dev)                              |
| Backend    | [Supabase](https://supabase.com)                                            |
| Auth       | Supabase Auth                                                               |
| Database   | Supabase Postgres + Realtime                                                |
| Storage    | Supabase Storage                                                            |
| Styling    | React Native + Dynamic Theming                                              |
| Navigation | React Navigation (Stack + Bottom Tabs)                                      |
| Deployment | [Expo EAS Build](https://expo.dev/eas) + [Appetize.io](https://appetize.io) |

---

##  Project Setup & Installation

### 1️ Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/framez.git
cd framez
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment

All environment variables are stored in `app.config.ts` under `extra:`
Update these with your Supabase project details:

```ts
extra: {
  EXPO_PUBLIC_SUPABASE_URL: "https://YOUR_SUPABASE_URL.supabase.co",
  EXPO_PUBLIC_SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
}
```

### 4️⃣ Run the app locally

```bash
npx expo start
```

Then scan the QR code with **Expo Go** (Android or iOS).

---

## 📱 Building the APK (for submission)

### Configure your EAS project

```bash
npx eas build:configure
```

Make sure your `app.config.ts` includes:

```ts
android: {
  package: "com.deborahkudaru.framez",
},
```

### Build your APK

```bash
npx eas build -p android --profile preview
```

When complete, Expo will provide a download link:

```
 Build complete
https://expo.dev/accounts/deborahkudaru/projects/framez/builds/xxxxxx
```

---

## ☁️ Hosting the Demo

1. Go to [https://appetize.io/upload](https://appetize.io/upload)
2. Upload the generated `.apk` file.
3. Copy the public share link and include it in your submission.

---

## 🎬 Demo Video Guide (2–3 minutes max)

You only need **2½ minutes** — here’s your flow:

### 🕒 Suggested Script

1. **(10s)** Intro:
   “Hi, I’m Deborah, and this is my project *Framez*, a social mobile app built with React Native and Supabase.”

2. **(30s)** Authentication:

   * Show signing up with a new user.
   * Log out and log back in.

3. **(40s)** Feed:

   * Show other users’ posts.
   * Tap refresh to show real-time update.
   * Like/unlike a post.

4. **(40s)** Create Post:

   * Add text and/or an image.
   * Publish and show that it appears instantly in the feed.

5. **(30s)** Profile:

   * Show your profile info, total posts, and join date.
   * Delete a post.
   * Show logout works.

6. **(10s)** Wrap up:
   “That’s Framez — a clean, real-time social app built with React Native and Supabase. Thank you!”

---

##  File Structure Overview

```
src/
 ┣ context/
 ┃ ┣ AuthContext.tsx
 ┃ ┗ ThemeContext.tsx
 ┣ lib/
 ┃ ┗ supabase.ts
 ┣ navigation/
 ┃ ┗ RootNavigator.tsx
 ┣ screens/
 ┃ ┣ FeedScreen.tsx
 ┃ ┣ CreatePostScreen.tsx
 ┃ ┣ ProfileScreen.tsx
 ┃ ┗ auth/
 ┃    ┣ LoginScreen.tsx
 ┃    ┗ RegisterScreen.tsx
 ┣ services/
 ┃ ┗ postService.ts
 ┗ utils/
    ┗ upload.ts
```

---

## 👩🏽‍💻 Author

**Deborah Kudaru**
 Web & Mobile Developer | React Native | Supabase | Web3
GitHub: [@deborahkudaru](https://github.com/deborahkudaru)

---


