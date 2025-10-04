# Changelog

All notable changes to the FocusFix extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Professional project structure with separate directories for components
- Comprehensive .gitignore for browser extension development
- Conventional commit standards and development guidelines
- Professional README.md with badges and comprehensive documentation

### Changed

- Reorganized folder structure to match industry standards
- Updated manifest.json paths to reflect new structure
- Improved file organization for better maintainability

## [1.0.0] - 2025-10-03

### Added

- Initial release of FocusFix browser extension
- Core accessibility fixes:
  - Visible focus outline injection for all focusable elements
  - Skip to content link insertion when missing
  - Tabindex order repair for navigation and forms
- Browser extension popup interface with feature toggles
- Settings page for customization (outline color, site preferences)
- Real-time diagnostics collection and display
- CSV export functionality for accessibility reports
- Cross-browser compatibility (Chrome Manifest V3, Firefox Manifest V2)
- Complete validation and testing scripts
- Comprehensive documentation and roadmaps

### Features

- **Focus Outline Enhancement**: Automatically adds visible focus indicators
- **Skip Navigation**: Inserts accessible skip-to-content links
- **Tab Order Repair**: Fixes problematic tabindex sequences
- **Settings Management**: Persistent user preferences via chrome.storage
- **Diagnostics**: Real-time accessibility issue reporting
- **CSV Export**: Professional accessibility audit reports
- **Privacy-First**: No data collection, local processing only

### Technical

- Manifest V3 service worker architecture
- Manifest V2 fallback for Firefox compatibility
- Error handling and graceful degradation
- Performance optimized DOM scanning
- Cross-site compatibility testing
- Professional validation and build scripts

### Documentation

- Complete installation and testing guides
- Comprehensive roadmap through v4.0.0
- Technical architecture documentation
- Market analysis and competitive positioning
- Production readiness checklist
