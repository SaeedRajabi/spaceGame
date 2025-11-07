// Create a simple game icon using base64 encoding
// This avoids the need for external dependencies

const fs = require('fs');

// Simple 48x48 icon as base64 data URL
const iconData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABKElEQVR4nO3ZvUoDQRiF4UcRtLDS1kYbG0Gx09LWzkYvQO9ALS3E3ktbC72FQOxsbW1sBcEiKBYWgqAgKPj3bJLN7OzO7Owks98Dh0lmk5nkwGFE5Jl8kR8yJU/khXyQd/JG3sgreSFv5Jm8kCfySJ7IPXkir+SB3JN7ckfuyC25ITfkmlyRC3JOLskFOSdn5JQck2NyRI7IITkg++SA7JN9skd2yQ7ZJltkkyyTJbJIFsg8mSNfyCQ5I5Nkgvwm42SIDBI/P5JP0ic90iVd0iFt0iJN0iB1UiNnpEpKpEgKJE9yJEu+SZqkyDlJkhOSIKfkH3khT+Se3JFbckOuyRW5JCfkjByTA3JA9sgu2SHbpEU2yTpZJUtkkSyQeTJHvpBpMkWmyCQZJ0NkiPi5kXykT3qkS7qkQ9qkRZqkQeqkRs5IlZRIkRRIHuZJFv4Bv5cP8gNjP1f4AvhY7QAAAABJRU5ErkJggg==";

// Convert data URL to binary
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

// For Node.js environment, we'll just save the base64 data directly
function saveBase64AsFile(base64, fileName) {
    // Remove the data URL prefix
    const base64Data = base64.replace(/^data:image\/png;base64,/, "");
    
    // Write to file
    fs.writeFileSync(fileName, base64Data, 'base64');
    console.log(`Created icon: ${fileName}`);
}

// Create directories if they don't exist
const iconSizes = ['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
iconSizes.forEach(size => {
    const dir = `res/icon/android`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Save the same icon for all densities (in a real app, you'd have different sized icons)
iconSizes.forEach(size => {
    saveBase64AsFile(iconData, `res/icon/android/${size}-icon.png`);
});

console.log('All app icons created successfully!');