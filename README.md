# XPQuest - Habit Tracker with Gamification

XPQuest is a gamified habit tracking application that turns your daily habits into an RPG-style quest. Build better habits while leveling up your character and tracking your progress.

## Features

- **Habit Tracking**: Track daily, weekly, and one-time habits
- **XP & Leveling System**: Earn XP for completing habits and level up your character
- **Streaks**: Build and maintain streaks for consistent habit completion
- **Custom Avatars**: Upload your own 1:1 aspect ratio images as your character avatar
- **Statistics Dashboard**: Track your progress with visual statistics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Zustand (for state management)
- Shadcn UI components
- LocalStorage (for data persistence)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later

### Installation

1. Clone the repository
   ```
   git clone https://github.com/drunktrader/xp_quest.git
   cd xp_quest
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

XPQuest is configured for easy deployment to GitHub Pages.

1. Push your changes to GitHub
   ```
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Deploy to GitHub Pages
   ```
   npm run deploy
   ```

Alternatively, the project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

## Project Structure

- `/app`: Next.js pages and routes
- `/components`: React components
- `/components/ui`: Shadcn UI components
- `/hooks`: Custom React hooks
- `/public`: Static files
- `/stores`: Zustand store for state management
- `/types`: TypeScript type definitions
- `/utils`: Utility functions

## Features in Detail

### Habit Management

XPQuest allows you to create, edit, and delete habits of different types:
- **Daily Habits**: Reset each day
- **Weekly Habits**: Reset each week
- **One-time Habits**: Complete once and they're done

Each habit has a customizable XP reward that you'll earn when completing it.

### XP and Leveling System

As you complete habits, you earn XP points that contribute to your level. The leveling system follows a progressive curve, requiring more XP to reach higher levels.

### Avatar System

You can customize your character by uploading your own avatar image. The system ensures all images are cropped to a perfect 1:1 aspect ratio for consistent display.

### Streak Tracking

The app tracks your daily habit completion streaks, encouraging consistency in your habits.

### Statistics

Track your progress with visual statistics including:
- Habit completion rates
- XP earned over time
- Streak data

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling