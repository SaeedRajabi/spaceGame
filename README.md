# Simple Android Game

A simple Android game created with HTML5, CSS, and JavaScript that can be packaged for Android using Apache Cordova.

## Game Description

This is a simple space shooter game where you control a spaceship at the bottom of the screen. Enemies fall from the top, and your ship automatically shoots bullets to destroy them. Avoid getting hit by enemies to survive as long as possible and achieve a high score!

## Prerequisites

To build and run this game, you'll need:

1. Node.js (https://nodejs.org/)
2. Android Studio with SDK (https://developer.android.com/studio)
3. Apache Cordova CLI (`npm install -g cordova`)

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Add the Android platform:
   ```
   cordova platform add android
   ```

## Building the Game

To build the game for Android:
```
cordova build android
```

## Running the Game

To run the game on an Android device or emulator:
```
cordova run android
```

## Game Controls

- On mobile devices: Touch and drag to move your spaceship
- On desktop: Click and drag to move your spaceship

## How to Play

- Enemies fall from the top of the screen
- Your spaceship automatically shoots bullets
- Destroy enemies to earn points (10 points per enemy)
- Avoid colliding with enemies or you'll lose the game
- Try to achieve the highest score possible!

## Customization

Feel free to customize the game by modifying:
- `index.html`: Game layout and UI
- `game.js`: Game logic and mechanics
- `config.xml`: App configuration and metadata

## License

This project is licensed under the MIT License.