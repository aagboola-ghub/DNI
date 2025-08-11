# Marchex DNI Demo - Modular Edition

## Overview
A modular, rebrandable demonstration of Marchex's Dynamic Number Insertion (DNI) technology with journey state management.

## Quick Start
1. Open `index.html` in a web browser
2. To customize for a client: 
   - Copy `config/brands/_template.json` to `config/brands/[client-name].json`
   - Update brand values
   - Add logo to `assets/logos/`
   - Open `index.html?brand=[client-name]`

## Project Structure
```
marchex-dni-demo/
├── index.html           # Main entry point
├── config/              # Configuration files
├── assets/              # Static assets
├── css/                 # Stylesheets
├── js/                  # JavaScript modules
└── templates/           # HTML templates
```

## Features
- Pre-click (SERP/Feed) and Post-click journey states
- 7 traffic source configurations
- Dynamic phone number replacement
- Call analytics with 10 tracking fields
- Easy rebranding via configuration

## Documentation
See `/docs` folder for detailed documentation.
