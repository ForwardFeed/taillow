# Taillow, Let me look that up.

# Why?
Because having multiple codebase was tiring me. Doing compatibility between each tool was frail and prone to bugs due to changes
The dex was done in haste and its foundation weren't build for long term maintainability but rather short term emergency.
The smogon calc is a 11 years old project that is victim of terrible technical debts that prevents a lot of improvement, it wasn't built for multiversionning nor speed.
Some others project have been started but none had caught my attention seriously.

# How to setup the project

### config_data.ts
This is if you want to make data in dataing! it's not used by the UI/
in the root folder there's a missing file called config_data.ts and there's a file called config_data_template.ts, copy it to config_data.ts and it's almost setup'd, you need to fill it. this file is meant to be kept privately as they may have some sensitive data in it.
Some fields in it aren't used currently if you ever get confused by it sorry.

### config.ts
This is a general config that should be accessibly by all sub projects. It's not critical to understand it, 
there's the appName in it which is used for localstorage purposes only, and the list of version available (if you want to add a version
you need to start by that.)


Each sub project have their own dependencies made using npm and nodeJS. But they are functionning independently.

# How to understand the project structure?
The structure of the project is monolithic but there's 4 sub projects

## Dataing
This project is to craft data meant to be used by the ui & the calculator, it's kinda the origin of most truth, the config file in it is used widely (I may change that)

## ui
The UI that will consume the data from the dataing and ship the calc too.

## calc
A calculator made with web assembly.

## project_tui
I just did that for the fun, it's an UI in the terminal (you can even click on buttons) which may work only for linux.
I needed to work on vue, so this was a good training ground.

# notes
Taillow is my biggest planned project. took me a while to design it.
