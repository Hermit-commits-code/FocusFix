# FocusFix - Accessibility Browser Extension

![FocusFix Logo](assets/logo-banner.png)

**Automatically repair broken keyboard navigation and focus management on any website**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Firefox](https://img.shields.io/badge/firefox-supported-orange.svg)](https://addons.mozilla.org/firefox/)
[![Chrome](https://img.shields.io/badge/chrome-coming_soon-yellow.svg)](#)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)

[📦 Install](#-installation) • [🚀 Features](#-features) • [📖 Documentation](#-documentation) • [🛠️ Development](#️-development) • [🤝 Contributing](#-contributing)

## 🎯 What is FocusFix?

FocusFix is a privacy-first browser extension that automatically detects and repairs keyboard navigation issues on web pages in real-time. Unlike accessibility audit tools or overlay widgets, FocusFix applies direct DOM and CSS modifications to improve focus indicators, skip navigation, and tabindex order as you browse. Its goal is to make websites immediately more usable for keyboard-only users without requiring site owners to make changes.

### ✨ Key Differentiators

• 🔧 **Real DOM Fixes**: Modifies actual webpage content, not overlays or audit reports  
• ⌨️ **Keyboard-First**: Focused specifically on keyboard navigation improvements  
• 🔒 **Privacy-First**: Entirely client-side processing, no data collection  
• ⚙️ **Granular Control**: Per-site and per-rule configuration flexibility  
• ⚡ **Real-Time**: Immediate fixes as you browse, no page reloads required  
• � **Targeted Scope**: Focus indicators, skip links, and tab order only

## 🚀 Features

### Core Keyboard Navigation Fixes

| Feature                   | Status      | Description                                           |
| ------------------------- | ----------- | ----------------------------------------------------- |
| Focus Outline Enhancement | ✅ Complete | Visible focus indicators for all interactive elements |
| Skip to Content Links     | ✅ Complete | Automatic skip navigation insertion when missing      |
| Tabindex Order Repair     | ✅ Complete | Logical keyboard navigation sequence fixing           |
| Real-time Diagnostics     | ✅ Complete | Live keyboard navigation issue detection and reporting      |
| Settings Export           | ✅ Complete | Export configuration and diagnostics data              |
| Per-Site Configuration   | ✅ Complete | Persistent user preferences and site-specific rules         |

All core modules are focused on improving keyboard navigation experience. See [ROADMAP.md](ROADMAP.md) for future keyboard-focused features.

### Upcoming Keyboard Features (Roadmap)

• ⚡ **Advanced Tab Order**: Smart tab sequence based on visual layout  
• � **Custom Focus Styles**: User-defined focus indicator appearance  
• ⌨️ **Keyboard Shortcuts**: Quick navigation with custom hotkeys  
• 🎯 **Focus Context**: Highlight containers and navigation groups  
• 🔄 **Focus Restoration**: Remember and restore focus in dynamic content  
• 🌐 **Cross-Platform**: Chrome support and mobile browser compatibility

## 🚀 v1.1.0 Features

- Chrome extension support (Manifest V3)
- Advanced focus indicators: animated rings, high contrast mode, custom styles
- Multiple skip links: content, navigation, footer
- Always-visible skip links (optional)
- Context-aware focus styles for buttons, links, inputs

## 📦 Installation

### Firefox (Available Now)

1. **Firefox Add-ons Store (Recommended)**

   ```
   Visit: https://addons.mozilla.org/firefox/addon/focusfix/
   Click "Add to Firefox"
   ```

2. **Manual Installation (Development)**
   ```bash
   git clone https://github.com/yourusername/focusfix-extension.git
   cd focusfix-extension
   # Open Firefox and go to about:debugging
   # Click "This Firefox" → "Load Temporary Add-on"
   # Select manifest.json
   ```

### Chrome (Available for Testing)

1. **Manual Installation (Development)**
   ```bash
   git clone https://github.com/yourusername/focusfix-extension.git
   cd focusfix-extension
   # Open Chrome and go to chrome://extensions
   # Enable "Developer mode"
   # Click "Load unpacked"
   # Select the project folder (with manifest-chrome.json)
   ```

Chrome Web Store release planned for v1.1.0. [Track progress →](ROADMAP.md#phase-7-cross-platform-expansion-month-2)

## 🎮 Quick Start

### Basic Usage

1. Install the extension from Firefox Add-ons store
2. Visit any webpage - FocusFix automatically scans for keyboard navigation issues
3. Click the extension icon to see fixes applied and customize focus behavior
4. Use Tab key to navigate - notice improved focus indicators and logical tab order
5. Access advanced settings for per-site configuration and focus customization

### Example: Before & After

**Before FocusFix:**

```html
<!-- Invisible focus, broken tab order, no skip navigation -->
<button style="outline: none;">Submit</button>
<input type="email" placeholder="Email" tabindex="100" />
<nav>
  <a href="/services" tabindex="50">Services</a>
  <a href="/about" tabindex="10">About</a>
</nav>
<!-- Missing skip link for keyboard users -->
```

**After FocusFix:**

```html
<!-- Auto-inserted skip link for keyboard navigation -->
<a href="#main-content" class="focusfix-skip-link">Skip to Content</a>

<!-- Enhanced focus visibility, logical tab order -->
<button style="outline: 2px solid #1976d2; outline-offset: 2px;">Submit</button>
<input type="email" placeholder="Email" tabindex="0" />
<nav>
  <a href="/about" tabindex="0">About</a>
  <a href="/services" tabindex="0">Services</a>
</nav>
```

## ⚙️ Configuration

### Keyboard Navigation Settings

| Category          | Description                      | Default       |
| ----------------- | -------------------------------- | ------------- |
| Focus Enhancement | Visible focus outline injection  | Enabled       |
| Skip Navigation   | Skip to content link insertion   | Enabled       |
| Tab Order Repair  | Tabindex sequence fixing         | Enabled       |
| Focus Color       | Custom focus indicator color     | #1976d2       |
| Site-Specific Rules | Per-domain keyboard behavior    | As configured |

### Focus Customization

```javascript
// Custom focus style example
{
  "focusOutline": {
    "color": "#1976d2",
    "width": "2px", 
    "style": "solid",
    "offset": "2px"
  },
  "skipLinks": {
    "enabled": true,
    "position": "top-left",
    "showOnFocus": true
  }
}
```

## 📦 Folder Structure

- background/ — Background scripts
- content/ — Content scripts
- popup/ — Extension popup UI
- options/ — Settings page
- icons/ — Extension icons
- docs/ — Documentation
- scripts/ — Utility scripts
- test-resources/ — Test pages and artifacts

## 🛠️ Development

### Prerequisites

• **Node.js**: 18.0.0 or higher  
• **npm**: 8.0.0 or higher  
• **Firefox Developer Edition**: For testing  
• **Git**: For version control

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/focusfix-extension.git
cd focusfix-extension

# Install dependencies
npm install

# Start development server
npm run watch

# Run tests
npm test

# Build for production
npm run build:prod
```

### Development Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run build`    | Build production version             |
| `npm run watch`    | Development build with file watching |
| `npm test`         | Run full test suite                  |
| `npm run lint`     | Check code quality                   |
| `npm run format`   | Format code with Prettier            |
| `npm run validate` | Complete validation suite            |

### Project Structure

```
focusfix-extension/
├── 📁 background/          # Service worker and core logic
│   └── background.js       # Main background script
├── 📁 content/             # Content scripts for DOM manipulation
│   └── content.js          # Main content script
├── 📁 popup/               # Browser action popup UI
│   ├── popup.html          # Popup interface
│   └── popup.js           # Popup logic
├── 📁 options/             # Settings page
│   ├── options.html        # Settings interface
│   └── options.js         # Settings logic
├── 📁 utils/               # Shared utilities
├── 📁 icons/               # Extension icons
├── 📁 tests/               # Test suites
├── 📁 docs/                # Documentation
├── manifest.json           # Extension manifest
├── package.json            # Node.js configuration
└── README.md              # This file
```

## 🌐 Browser Support
- Chrome: Manifest V3 (`manifest.json`)
- Firefox: Manifest V2 (`manifest-firefox.json`)

## 🚀 v1.1.0 Feature Summary
- Animated and high-contrast focus indicators
- Custom focus styles and context-aware outlines
- Multiple, always-visible skip links
- Debug banner for development/testing
- Robust cross-browser compatibility

### Code Quality Standards

• **Test Coverage**: Minimum 90% coverage required  
• **ESLint**: Zero lint errors or warnings  
• **Prettier**: Consistent code formatting  
• **Conventional Commits**: All commits follow standard format  
• **Signed Commits**: All commits are GPG signed

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Categories

• **Unit Tests**: Focus indicator and tab order logic testing  
• **Integration Tests**: Real-world keyboard navigation scenarios  
• **Performance Tests**: Memory usage and DOM manipulation timing  
• **Compatibility Tests**: Cross-browser keyboard behavior testing

## 🏗️ Build & Test Instructions

### Chrome
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select your project folder (with Manifest V3)
4. Test features: animated focus rings, skip links, high contrast mode, custom styles

### Firefox
1. Open Firefox Developer Edition
2. Go to `about:debugging`
3. Click "This Firefox" → "Load Temporary Add-on"
4. Select your project folder and choose Manifest V2
5. Test features as above

## 🌐 Cross-Browser Notes
- FocusFix is tested and optimized for Chrome (Manifest V3) and Firefox (Manifest V2)
- Some sites (Twitter, Chrome Web Store) may block extension scripts due to CSP
- For best results, test on a variety of real-world sites

## 🤝 Contributing

We welcome contributions from the keyboard navigation and accessibility community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/keyboard-improvement`)
3. ✨ Make your changes with tests
4. ✅ Validate with `npm run validate`
5. 💬 Commit with conventional format (`git commit -m 'feat: improve tab order logic'`)
6. 📤 Push to the branch (`git push origin feature/keyboard-improvement`)
7. 🔃 Open a Pull Request

### Development Guidelines

• Follow the [Code of Conduct](CODE_OF_CONDUCT.md)  
• Write comprehensive tests for keyboard navigation features  
• Update documentation for any focus behavior changes  
• Test with keyboard-only navigation  
• Follow semantic versioning for releases

## 📚 Documentation

| Document                            | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| [🗺️ Roadmap](ROADMAP.md)            | Keyboard navigation development roadmap |
| [📝 Changelog](CHANGELOG.md)        | Detailed version history and release notes    |
| [🤝 Contributing](CONTRIBUTING.md)  | Guidelines for contributors                   |
| [📖 API Reference](docs/api.md)     | Focus fix API documentation                   |
| [🔧 Architecture](docs/architecture.md)  | Technical architecture overview               |
| [🎯 User Guide](docs/user-guide.md) | Complete keyboard navigation user guide                   |

## 🛣️ Roadmap

### Current Version: v1.0.0 - Core Keyboard Navigation Fixes ✅

### Upcoming Releases

| Version | Timeline | Features                                       |
| ------- | -------- | ---------------------------------------------- |
| v1.1.0  | Month 1  | Chrome extension support, advanced focus indicators |
| v1.2.0  | Month 2  | Smart tab order logic, performance optimization    |
| v1.3.0  | Month 3  | Visual focus enhancements, modal focus trapping              |
| v2.0.0  | Month 6  | Advanced keyboard navigation, developer tools                |
| v1.1.0  | Month 1  | Chrome extension support, enhanced diagnostics |
| v1.2.0  | Month 2  | ARIA repair engine, color contrast analysis    |
| v1.3.0  | Month 3  | Premium features, team management              |
| v2.0.0  | Month 6  | Enterprise platform, API access                |

[View Complete Roadmap →](ROADMAP.md)

## 📊 Browser Compatibility

| Browser    | Status          | Version                 |
| ---------- | --------------- | ----------------------- |
| 🦊 Firefox | ✅ Supported    | 109.0+                  |
| 🌐 Chrome  | 🔄 Coming Soon  | 88.0+ (v1.1.0)          |
| 🔷 Edge    | 🔄 Planned      | Chromium-based (v1.2.0) |
| 🧭 Safari  | 📋 Under Review | TBD                     |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2025 FocusFix Team
```

## 🙏 Acknowledgments

• [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) for keyboard accessibility standards  
• [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) for browser integration  
• Keyboard navigation community for feedback and testing  
• [WebAIM](https://webaim.org/articles/keyboard/) for keyboard accessibility resources

## 📞 Support & Community

### Get Help

• 📚 **Documentation**: [docs/](docs/)  
• 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/focusfix-extension/issues)  
• 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/focusfix-extension/discussions)  
• 📧 **Email**: [support@focusfix.tools](mailto:support@focusfix.tools)

### Stay Updated

• 🐦 **Twitter**: [@FocusFix](https://twitter.com/focusfix)  
• 📖 **Blog**: [blog.focusfix.tools](https://blog.focusfix.tools/)  
• 📧 **Newsletter**: [Subscribe for updates](https://focusfix.tools/newsletter)

---

⭐ **Star this repository if FocusFix improves your keyboard navigation experience!** ⭐

_Making keyboard navigation better, one website at a time._

## 🛠️ Troubleshooting & Limitations

FocusFix may not work on all websites due to browser security restrictions:
- Sites with strict Content Security Policy (CSP), like Twitter or Chrome Web Store, may block extension scripts and styles.
- Internal browser pages (chrome://, about:) do not allow extensions.
- Some sites use custom protections against third-party scripts.

### How to Check if FocusFix is Running
- Open DevTools Console and look for "FocusFix Content Script" logs.
- Tab through the page: look for visible focus rings and skip links.
- Try on a simple site (like example.com) to confirm extension functionality.
- Enable debug mode (see below) for a visible "FocusFix active" banner.

### Debug Mode
- You can enable debug mode in settings or via the extension popup to show a small "FocusFix active" banner on supported pages.

### User Feedback
- If FocusFix does not work on a site, please report it via GitHub Issues. Include the site URL and any error messages from DevTools Console.

For more details, see the docs/ folder and ROADMAP.md.
