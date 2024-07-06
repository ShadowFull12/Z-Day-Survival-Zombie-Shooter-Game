
# Z-Day: Survival

Welcome to **Z-Day: Survival**, a 3D survival zombie shooter game built entirely with HTML, inline CSS, and JavaScript. This game features complex shop and power-up systems, providing an immersive experience.

## Description
Z-Day: Survival is a beta version of a thrilling survival game where players must navigate a zombie-infested world. The game includes a detailed HUD, minimap, shop for purchasing weapons and upgrades, and various power-ups to enhance gameplay.

## Features
- **3D Mechanics**: Experience an engaging 3D environment.
- **Complex Shop System**: Purchase weapons, upgrades, and power-ups.
- **Power-Ups**: Enhance your abilities to survive longer.
- **HUD**: Track your health, stamina, shield, and more.
- **Minimap**: Navigate the game world with ease.

## Beta Notice
This is a beta version, and some features may not work as intended. We welcome contributions from the community to help improve the game.

## Getting Started

### Prerequisites
- Web browser with HTML, CSS, and JavaScript support.

### Installation
1. Clone the repository:
   \`\`\`sh
   git clone https://github.com/ShadowFull12/Z-Day-Survival-Zombie-Shooter-Game.git
   \`\`\`
2. Open \`Zombie Game.html\` in your web browser.

## How to Play
- **Start Game**: Click on the 'Start Game' button to begin.
- **Move**: Use WASD keys to move around.
- **Shoot**: Click the left mouse button to shoot.
- **Shop**: Press 'Enter' to open the shop during gameplay.
- **Power-Ups**: Collect power-ups scattered throughout the game to enhance your abilities.

## Code Structure
- **HTML**: The entire game is contained within a single HTML file.
- **CSS**: Inline CSS is used for styling.
- **JavaScript**: All game mechanics are handled through inline JavaScript.

## Key Sections
- **HUD**: Displays player stats like health, stamina, shield, and level.
- **Weapon HUD**: Shows the current weapons and their stats.
- **Minimap**: Provides a visual representation of the player’s surroundings.
- **Shop**: Allows players to buy weapons and upgrades.
- **Power-Ups**: Various items that provide temporary boosts.

## Example Code Snippets

### HUD
\`\`\`html
<div id="hud" style="display: none;">
  <h3>Player Stats</h3>
  <div class="stat">
    <span class="stat-label">Health</span>
    <div id="health-bar" class="bar"><div class="bar-fill"></div></div>
  </div>
  <div class="stat">
    <span class="stat-label">Stamina</span>
    <div id="stamina-bar" class="bar"><div class="bar-fill"></div></div>
  </div>
  <div class="stat">
    <span class="stat-label">Shield</span>
    <div id="shield-bar" class="bar"><div class="bar-fill"></div></div>
  </div>
  <div class="stat">
    <span class="stat-label">Level</span>
    <span id="level">1</span>
  </div>
</div>
\`\`\`

### Shop
\`\`\`html
<div id="shop-overlay">
  <div id="shop-content">
    <h2>Shop</h2>
    <div id="shop-tabs">
      <button class="shop-tab active" onclick="showShopSection('weapons')">Weapons</button>
      <button class="shop-tab" onclick="showShopSection('upgrades')">Upgrades</button>
    </div>
    <div id="shop-sections">
      <!-- Shop sections for weapons and upgrades -->
    </div>
  </div>
</div>
\`\`\`

### Power-Ups
\`\`\`html
<div id="powerups">
  <!-- Code for displaying power-ups -->
</div>
\`\`\`

## Contribution
We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch (\`git checkout -b feature-branch\`).
3. Make your changes.
4. Commit your changes (\`git commit -m 'Add some feature'\`).
5. Push to the branch (\`git push origin feature-branch\`).
6. Open a pull request.

Please ensure to give appropriate credit to ShadowFull12 on GitHub when making any contributions.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any questions or suggestions, feel free to open an issue or contact ShadowFull12 on GitHub.
