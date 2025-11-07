# Space Defender - Android Game

## Game Overview

Space Defender is a simple yet engaging Android game built using HTML5, CSS, and JavaScript. The game can be packaged for Android using Apache Cordova/PhoneGap.

## Game Features

1. **Simple Controls**: Touch/drag on mobile or click/drag on desktop to move your spaceship
2. **Auto-Shooting**: Your spaceship automatically fires bullets at enemies
3. **Progressive Difficulty**: Game gets harder as your score increases
4. **High Score Tracking**: Game remembers your highest score using localStorage
5. **Sound Effects**: Web Audio API for immersive sound effects
6. **Responsive Design**: Works on both mobile and desktop devices

## Game Mechanics

- Control a green spaceship at the bottom of the screen
- Red enemy circles fall from the top
- Your spaceship automatically shoots blue bullets
- Destroy enemies to earn points (10 points per enemy)
- Avoid colliding with enemies or the game ends
- Difficulty increases as your score gets higher:
  - Enemies spawn more frequently
  - Enemies move faster

## Technical Implementation

### Core Technologies
- HTML5 Canvas for rendering
- JavaScript for game logic
- CSS for styling
- Web Audio API for sound effects
- Apache Cordova for Android packaging

### File Structure
```
GameMafia/
├── index.html          # Main game HTML file
├── game.js             # Game logic and mechanics
├── styles.css          # Game styling
├── config.xml          # Cordova configuration
├── package.json        # Project dependencies
├── manifest.json       # Web app manifest
├── build.bat           # Windows build script
├── README.md           # Project documentation
├── GAME_SUMMARY.md     # This file
├── splash.html         # Splash screen (concept)
├── icon.html           # Icon generator (concept)
├── simple-icon.js      # Icon creation script
├── res/                # Resources directory
│   └── icon/           # App icons
│       └── android/    # Android-specific icons
└── platforms/          # Cordova platform files (generated)
```

### How to Build and Run

1. **Prerequisites**:
   - Node.js (https://nodejs.org/)
   - Android Studio with SDK (https://developer.android.com/studio)
   - Apache Cordova CLI (`npm install -g cordova`)

2. **Build Process**:
   - Run `build.bat` on Windows
   - Or manually execute:
     ```
     npm install
     cordova platform add android
     cordova build android
     ```

3. **Output**:
   - Generated APK will be located at:
     `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

## Customization Options

- **Game Logic**: Modify [game.js](game.js) to change gameplay mechanics
- **Visuals**: Update [styles.css](styles.css) for different styling
- **Layout**: Edit [index.html](index.html) for UI changes
- **App Info**: Update [config.xml](config.xml) and [package.json](package.json) for app metadata
- **Icons**: Replace files in [res/icon/android/](res/icon/android/) with custom icons

## Future Enhancements

1. Add power-ups and special weapons
2. Implement multiple lives
3. Add different enemy types
4. Include background music
5. Add particle effects for explosions
6. Implement leaderboards
7. Add more levels with different backgrounds
8. Include tilt controls for mobile devices

## License

This project is licensed under the MIT License.