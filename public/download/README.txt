========================================
HOW TO ADD YOUR GAME FOR DOWNLOAD
========================================

This folder is where you should place your game files so visitors can download them.

STEP-BY-STEP INSTRUCTIONS:
--------------------------

1. BUILD YOUR GAME IN RELEASE MODE
   - Open your project in Visual Studio
   - Change from "Debug" to "Release" at the top
   - Build Solution (F7 or Ctrl+Shift+B)
   - This creates an optimized version of your game

2. LOCATE YOUR GAME FILES
   Your .exe file will be in one of these locations:
   - Release\CIE101_ProjectStartupCode.exe
   - x64\Release\CIE101_ProjectStartupCode.exe

   You also need these DLL files (in the same folder):
   - CMUgraphicsLib.dll
   - Any other DLLs that appear in the Release folder

3. GATHER REQUIRED FILES
   Create a folder with these files:
   - Your game .exe file (rename to RiverRaid.exe)
   - CMUgraphicsLib.dll
   - Any image/sound files your game uses
   - (Optional) README.txt with instructions

4. CREATE A ZIP FILE
   - Select all the game files
   - Right-click → "Send to" → "Compressed (zipped) folder"
   - Name it: RiverRaid.zip

5. PLACE THE ZIP FILE HERE
   - Copy RiverRaid.zip to this folder:
     E:\C++ codes\Cpp project uni\RiverRaidGame\startup code\CIE101_ProjectStartupCode\online-server\public\download\

   - The file should be named exactly: RiverRaid.zip

6. TEST THE DOWNLOAD
   - Start your server (npm start)
   - Open: http://localhost:3000/leaderboard.html
   - Click the download button
   - Verify the download works

7. DEPLOY
   After testing locally:
   - Commit the zip file to git:
     git add public/download/RiverRaid.zip
     git commit -m "Add game download"
     git push

   - Render will automatically redeploy
   - Your game will be downloadable at:
     https://your-app.onrender.com/leaderboard.html

========================================
EXAMPLE FOLDER STRUCTURE
========================================

public/
├── download/
│   ├── RiverRaid.zip  ← Your game zip file goes here
│   └── README.txt     ← This file
├── leaderboard.html
├── leaderboard.css
└── leaderboard-online.js

========================================
WHAT TO INCLUDE IN THE ZIP
========================================

RiverRaid.zip should contain:
├── RiverRaid.exe         ← Your game executable
├── CMUgraphicsLib.dll    ← Required library
├── README.txt            ← Instructions for players
└── (any other DLLs or assets your game needs)

========================================
TIPS
========================================

- Use Release build, not Debug (smaller and faster)
- Test the zip file yourself before uploading
- Include clear instructions in the README
- Keep the file size reasonable (under 50MB)
- Make sure all required DLLs are included

========================================
TROUBLESHOOTING
========================================

"Download button doesn't work"
→ Make sure the file is named exactly: RiverRaid.zip
→ Check it's in the public/download/ folder
→ Restart the server

"Game doesn't run after download"
→ Include all required DLL files
→ Test on another computer first
→ Add troubleshooting to your README

"File is too large"
→ Only include necessary files
→ Remove debug symbols (use Release build)
→ Compress images if needed

========================================

Once RiverRaid.zip is in this folder, the download button on the leaderboard will automatically work!
