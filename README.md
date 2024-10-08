# Taillow, Let me look that up.

# Why?
Because having multiple codebase was tiring me. Doing compatibility between each tool was frail and prone to bugs due to changes
The dex was done in haste and its foundation weren't build for long term maintainability but rather short term emergency.
The smogon calc is a 11 years old project that is victim of terrible technical debts that prevents a lot of improvement, it wasn't built for multiversionning nor speed.
Some others project have been started but none had caught my attention seriously.

# How to setup the project
in dataing/, there's a missing file called config.ts and there's a file called config_template.ts, rename it to config.ts and it's setup'd.
Each sub project have their own dependencies using npm and nodeJS. the top folder has one too, but it's mostly for convenience and could be removed in the future.

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
